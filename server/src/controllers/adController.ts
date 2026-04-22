import { Request, Response } from 'express';
import { supabase } from '../db/client';
import { CreateAdInput, UpdateAdInput, SubmitAdSchema } from '../../../shared/schemas';

/**
 * Create a new ad draft
 */
export async function createAd(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const body = req.body as CreateAdInput;

    const slug = `${body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.floor(Date.now() / 1000)}`;

    const { data: ad, error: adError } = await supabase
      .from('ads')
      .insert({
        user_id: userId,
        title: body.title,
        description: body.description,
        category_id: body.category_id,
        city_id: body.city_id,
        slug,
        status: 'draft'
      })
      .select()
      .single();

    if (adError || !ad) {
      console.error(adError);
      return res.status(400).json({ success: false, message: 'Failed to create ad' });
    }

    if (body.media_urls && body.media_urls.length > 0) {
      const mediaRecords = body.media_urls.map(media => ({
        ad_id: ad.id,
        source_type: media.source_type,
        original_url: media.original_url,
        display_order: media.display_order || 0
      }));

      const { error: mediaError } = await supabase.from('ad_media').insert(mediaRecords);
      if (mediaError) {
        console.error('Media upload error:', mediaError);
      }
    }

    return res.status(201).json({ success: true, data: ad });
  } catch (error) {
    console.error('Error creating ad:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

/**
 * Update a draft ad
 */
export async function updateAd(req: Request, res: Response) {
  try {
    const adId = req.params.id;
    const userId = req.userId;
    const body = req.body as UpdateAdInput;

    // Check if ad exists and belongs to user
    const { data: existingAd } = await supabase
      .from('ads')
      .select('*')
      .eq('id', adId)
      .eq('user_id', userId)
      .single();

    if (!existingAd) {
      return res.status(404).json({ success: false, message: 'Ad not found' });
    }

    if (existingAd.status !== 'draft') {
      return res.status(400).json({ success: false, message: 'Can only update draft ads' });
    }

    const { data: ad, error: adError } = await supabase
      .from('ads')
      .update({
        title: body.title,
        description: body.description,
        category_id: body.category_id,
        city_id: body.city_id,
      })
      .eq('id', adId)
      .select()
      .single();

    if (adError) {
      console.error(adError);
      return res.status(400).json({ success: false, message: 'Failed to update ad' });
    }

    if (body.media_urls) {
        await supabase.from('ad_media').delete().eq('ad_id', adId);
        const mediaRecords = body.media_urls.map(media => ({
          ad_id: adId,
          source_type: media.source_type,
          original_url: media.original_url,
          display_order: media.display_order || 0
        }));
        await supabase.from('ad_media').insert(mediaRecords);
    }

    return res.status(200).json({ success: true, data: ad });
  } catch (error) {
    console.error('Error updating ad:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

/**
 * Get client's own ads
 */
export async function getClientAds(req: Request, res: Response) {
  try {
    const userId = req.userId;
    
    const { data: ads, error } = await supabase
      .from('ads')
      .select(`
        *,
        categories(name),
        cities(name),
        packages(name, price)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, message: 'Failed to fetch ads' });
    }

    return res.status(200).json({ success: true, data: ads });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

/**
 * Submit ad for review
 */
export async function submitAd(req: Request, res: Response) {
  try {
    const adId = req.params.id;
    const userId = req.userId;
    const { package_id } = req.body; // from SubmitAdSchema

    const { data: existingAd } = await supabase
      .from('ads')
      .select('*')
      .eq('id', adId)
      .eq('user_id', userId)
      .single();

    if (!existingAd) {
      return res.status(404).json({ success: false, message: 'Ad not found' });
    }

    if (existingAd.status !== 'draft') {
      return res.status(400).json({ success: false, message: 'Ad is already submitted or processed' });
    }

    const { data: ad, error } = await supabase
      .from('ads')
      .update({
        status: 'submitted',
        package_id
      })
      .eq('id', adId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, message: 'Failed to submit ad' });
    }

    // create status history log
    await supabase.from('ad_status_history').insert({
      ad_id: adId,
      previous_status: 'draft',
      new_status: 'submitted',
      changed_by: userId,
      note: 'Client submitted ad for review'
    });

    return res.status(200).json({ success: true, data: ad });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
