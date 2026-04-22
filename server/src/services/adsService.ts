import { supabase } from '../db/client';
import { AdFilterInput } from '../../../shared/schemas';

export async function searchAds(filters: AdFilterInput) {
  let query = supabase
    .from('ads')
    .select('*, categories(name), cities(name), users(name, email), packages(weight, is_featured)', { count: 'exact' })
    .eq('status', 'published');

  if (filters.category_id) query = query.eq('category_id', filters.category_id);
  if (filters.city_id) query = query.eq('city_id', filters.city_id);
  if (filters.package_id) query = query.eq('package_id', filters.package_id);
  if (filters.search) query = query.ilike('title', `%\${filters.search}%`);

  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  if (filters.sort_by === 'newest') query = query.order('publish_at', { ascending: false });
  else if (filters.sort_by === 'oldest') query = query.order('publish_at', { ascending: true });
  else {
      query = query.order('admin_boost_points', { ascending: false }).order('publish_at', { ascending: false }); 
  }

  const { data, count, error } = await query;

  if (error) throw error;

  if (data && data.length > 0) {
     const adIds = data.map(ad => ad.id);
     const { data: media } = await supabase.from('ad_media').select('*').in('ad_id', adIds);
     data.forEach(ad => {
       ad.media = media ? media.filter(m => m.ad_id === ad.id) : [];
     });
  }

  return { data, total: count, page, limit };
}

export async function getPublicAd(slug: string) {
  const { data: ad, error } = await supabase
    .from('ads')
    .select('*, categories(name), cities(name), users(name, email), packages(name, duration_days)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !ad) throw new Error('Ad not found');

  const { data: media } = await supabase.from('ad_media').select('*').eq('ad_id', ad.id);
  ad.media = media || [];

  return ad;
}
