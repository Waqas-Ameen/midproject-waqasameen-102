import { supabase } from '../db/client';
import { publishAd } from '../services/publishingService';

export async function publishScheduledAds() {
  try {
    const now = new Date().toISOString();
    const { data: ads } = await supabase
      .from('ads')
      .select('id')
      .eq('status', 'scheduled')
      .lte('publish_at', now);

    if (ads && ads.length > 0) {
      for (const ad of ads) {
        try {
          await publishAd(ad.id);
        } catch (error) {
          console.error(`Failed to publish scheduled ad ${ad.id}`, error);
        }
      }
    }
  } catch (error) {
    console.error('publishScheduledAds cron failed', error);
  }
}

export async function expireOldAds() {
  try {
    const now = new Date().toISOString();
    const { data: ads } = await supabase
      .from('ads')
      .select('id')
      .eq('status', 'published')
      .lte('expire_at', now);

    if (ads && ads.length > 0) {
      for (const ad of ads) {
        await supabase
          .from('ads')
          .update({ status: 'expired' })
          .eq('id', ad.id);

        await supabase.from('ad_status_history').insert({
          ad_id: ad.id,
          previous_status: 'published',
          new_status: 'expired',
          note: 'Auto-expired by cron job'
        });
      }
    }
  } catch (error) {
    console.error('expireOldAds cron failed', error);
  }
}

export async function sendExpiringNotifications() {
  try {
    const now = new Date();
    const future = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();
    
    // Ads within 48 hours to expire
    const { data: ads } = await supabase
      .from('ads')
      .select('id, user_id, title')
      .eq('status', 'published')
      .lte('expire_at', future)
      .gte('expire_at', now.toISOString()); // only not expired yet

    if (ads && ads.length > 0) {
      for (const ad of ads) {
        // ideally check if notification already sent to avoid duplicate
        await supabase.from('notifications').insert({
          user_id: ad.user_id,
          title: 'Ad Expiring Soon',
          message: `Your ad "\${ad.title}" is expiring within 48 hours.`,
          type: 'expiring_soon',
          link_path: `/ads/${ad.id}`
        });
      }
    }
  } catch (error) {
    console.error('sendExpiringNotifications cron failed', error);
  }
}
