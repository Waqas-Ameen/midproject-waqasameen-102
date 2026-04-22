import { Request, Response } from 'express';
import { supabase } from '../db/client';
import { ReviewAdInput } from '../../../shared/schemas';

/**
 * Get pending ads for review
 */
export async function getPendingReviews(req: Request, res: Response) {
  try {
    const { data: ads, error } = await supabase
      .from('ads')
      .select(`
        *,
        categories(name),
        cities(name),
        users(name, email, role),
        packages(name)
      `)
      .eq('status', 'submitted')
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Fetch media for these ads
    if (ads && ads.length > 0) {
      const adIds = ads.map(a => a.id);
      const { data: media } = await supabase
        .from('ad_media')
        .select('*')
        .in('ad_id', adIds);

      // Attach media
      ads.forEach(ad => {
        ad.media = media ? media.filter(m => m.ad_id === ad.id) : [];
      });
    }

    return res.status(200).json({ success: true, data: ads });
  } catch (error) {
    console.error('Error fetching review queue:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

/**
 * Review an ad (approve or reject)
 */
export async function reviewAd(req: Request, res: Response) {
  try {
    const { id } = req.params; // ad_id
    const moderatorId = req.userId;
    const body = req.body as ReviewAdInput;

    const { data: ad, error: findError } = await supabase
      .from('ads')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !ad) {
      return res.status(404).json({ success: false, message: 'Ad not found' });
    }

    if (ad.status !== 'submitted') {
      return res.status(400).json({ success: false, message: 'Ad is not in submitted state' });
    }

    const newStatus = body.action === 'approve' ? 'payment_pending' : 'rejected';

    const { data: updatedAd, error: updateError } = await supabase
      .from('ads')
      .update({
        status: newStatus,
        reviewed_at: new Date().toISOString(),
        reviewed_by: moderatorId,
        rejection_reason: body.rejection_reason || null
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Add status history
    await supabase.from('ad_status_history').insert({
      ad_id: id,
      previous_status: ad.status,
      new_status: newStatus,
      changed_by: moderatorId,
      note: body.internal_notes || `Ad ${body.action}ed by moderator`
    });

    return res.status(200).json({ success: true, data: updatedAd });
  } catch (error) {
    console.error('Error reviewing ad:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
