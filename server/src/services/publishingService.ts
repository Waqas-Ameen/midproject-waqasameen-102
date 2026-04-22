import { supabase } from '../db/client';

export async function publishAd(adId: string, adminId: string | undefined = undefined) {
  const { data: ad, error: adError } = await supabase
    .from('ads')
    .select('*, packages(duration_days)')
    .eq('id', adId)
    .single();

  if (adError || !ad) throw new Error('Ad not found');
  if (ad.status !== 'payment_verified' && ad.status !== 'scheduled') throw new Error('Ad cannot be published from this state: ' + ad.status);

  const durationDays = ad.packages?.duration_days || 7;
  const now = new Date();
  const expireAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

  const { data: updatedAd, error } = await supabase
    .from('ads')
    .update({
      status: 'published',
      publish_at: now.toISOString(),
      expire_at: expireAt.toISOString(),
    })
    .eq('id', adId)
    .select()
    .single();

  if (error) throw error;

  await supabase.from('ad_status_history').insert({
    ad_id: adId,
    previous_status: ad.status,
    new_status: 'published',
    changed_by: adminId,
    note: 'Published successfully'
  });

  return updatedAd;
}

export async function scheduleAd(adId: string, publishDate: Date, adminId: string) {
  const { data: ad, error: adError } = await supabase
    .from('ads')
    .select('*')
    .eq('id', adId)
    .single();

  if (adError || !ad) throw new Error('Ad not found');
  if (ad.status !== 'payment_verified') throw new Error('Ad is not verified for payment');

  const { data: updatedAd, error } = await supabase
    .from('ads')
    .update({
      status: 'scheduled',
      publish_at: publishDate.toISOString(),
    })
    .eq('id', adId)
    .select()
    .single();

  if (error) throw error;

  await supabase.from('ad_status_history').insert({
    ad_id: adId,
    previous_status: 'payment_verified',
    new_status: 'scheduled',
    changed_by: adminId,
    note: `Scheduled by admin for ${publishDate.toISOString()}`
  });

  return updatedAd;
}
