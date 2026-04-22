import { createClient } from '@supabase/supabase-js';
import { User, Ad, Payment, Category, City, Package, Notification } from '../../../shared/types';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ============ User Queries ============

export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  return { data: data as User | null, error };
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  return { data: data as User | null, error };
}

export async function createUser(user: Omit<User, 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('users')
    .insert([user])
    .select()
    .single();

  return { data: data as User | null, error };
}

export async function updateUser(id: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data: data as User | null, error };
}

// ============ Ad Queries ============

export async function getAds(filters?: {
  status?: string;
  category_id?: string;
  city_id?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase.from('ads').select('*');

  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.category_id) query = query.eq('category_id', filters.category_id);
  if (filters?.city_id) query = query.eq('city_id', filters.city_id);

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(filters?.offset || 0, (filters?.offset || 0) + (filters?.limit || 20) - 1);

  return { data: data as Ad[], error, count };
}

export async function getAdById(id: string) {
  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .eq('id', id)
    .single();

  return { data: data as Ad | null, error };
}

export async function getAdBySlug(slug: string) {
  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .eq('slug', slug)
    .single();

  return { data: data as Ad | null, error };
}

export async function createAd(ad: Omit<Ad, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('ads')
    .insert([ad])
    .select()
    .single();

  return { data: data as Ad | null, error };
}

export async function updateAd(id: string, updates: Partial<Ad>) {
  const { data, error } = await supabase
    .from('ads')
    .update({ ...updates, updated_at: new Date() })
    .eq('id', id)
    .select()
    .single();

  return { data: data as Ad | null, error };
}

// ============ Package Queries ============

export async function getPackages() {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true });

  return { data: data as Package[], error };
}

export async function getPackageById(id: string) {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('id', id)
    .single();

  return { data: data as Package | null, error };
}

// ============ Category Queries ============

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name');

  return { data: data as Category[], error };
}

// ============ City Queries ============

export async function getCities() {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('is_active', true)
    .order('name');

  return { data: data as City[], error };
}

// ============ Payment Queries ============

export async function createPayment(payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('payments')
    .insert([payment])
    .select()
    .single();

  return { data: data as Payment | null, error };
}

export async function getPaymentByAdId(adId: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('ad_id', adId)
    .single();

  return { data: data as Payment | null, error };
}

export async function updatePayment(id: string, updates: Partial<Payment>) {
  const { data, error } = await supabase
    .from('payments')
    .update({ ...updates, updated_at: new Date() })
    .eq('id', id)
    .select()
    .single();

  return { data: data as Payment | null, error };
}

// ============ Audit Logs ============

export async function createAuditLog(log: any) {
  const { data, error } = await supabase.from('audit_logs').insert([log]).select().single();
  return { data, error };
}

// ============ Notifications ============

export async function createNotification(notification: Omit<Notification, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('notifications')
    .insert([notification])
    .select()
    .single();

  return { data: data as Notification | null, error };
}

// ============ Status History ============

export async function createStatusHistory(history: any) {
  const { data, error } = await supabase
    .from('ad_status_history')
    .insert([history])
    .select()
    .single();

  return { data, error };
}

// ============ Health Check ============

export async function logHealthCheck(source: string, response_ms: number, status: string, error_message?: string) {
  const { data, error } = await supabase
    .from('system_health_logs')
    .insert([
      {
        source,
        response_ms,
        status,
        error_message,
        checked_at: new Date(),
      },
    ])
    .select()
    .single();

  return { data, error };
}
