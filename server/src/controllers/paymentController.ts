import { Request, Response } from 'express';
import { supabase } from '../db/client';
import { SubmitPaymentInput, VerifyPaymentInput } from '../../../shared/schemas';

/**
 * Submit a payment proof (Client)
 */
export async function submitPayment(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const body = req.body as SubmitPaymentInput;

    const { data: ad, error: adError } = await supabase
      .from('ads')
      .select('*')
      .eq('id', body.ad_id)
      .eq('user_id', userId)
      .single();

    if (adError || !ad) {
      return res.status(404).json({ success: false, message: 'Ad not found' });
    }

    if (ad.status !== 'payment_pending') {
      return res.status(400).json({ success: false, message: 'Ad is not pending payment' });
    }

    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('transaction_ref', body.transaction_ref)
      .single();

    if (existingPayment) {
      return res.status(409).json({ success: false, message: 'Transaction reference already used' });
    }

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        ad_id: body.ad_id,
        amount: body.amount,
        method: body.method,
        transaction_ref: body.transaction_ref,
        sender_name: body.sender_name,
        screenshot_url: body.screenshot_url,
        status: 'submitted'
      })
      .select()
      .single();

    if (paymentError) {
       console.error(paymentError);
       return res.status(400).json({ success: false, message: 'Failed to submit payment' });
    }

    await supabase.from('ads').update({ status: 'payment_submitted' }).eq('id', body.ad_id);

    await supabase.from('ad_status_history').insert({
      ad_id: body.ad_id,
      previous_status: 'payment_pending',
      new_status: 'payment_submitted',
      changed_by: userId,
      note: 'Payment submitted by user'
    });

    return res.status(201).json({ success: true, data: payment });
  } catch (error) {
    console.error('Payment submit error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

/**
 * Get payment queue (Admin)
 */
export async function getPaymentQueue(req: Request, res: Response) {
  try {
    const { data: payments, error } = await supabase
      .from('payments')
      .select(`
        *,
        ads(title, packages(name, price))
      `)
      .eq('status', 'submitted')
      .order('created_at', { ascending: true });

    if (error) {
       return res.status(400).json({ success: false, message: 'Failed to fetch payment queue' });
    }

    return res.status(200).json({ success: true, data: payments });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

/**
 * Verify payment (Admin)
 */
export async function verifyPayment(req: Request, res: Response) {
  try {
    const adminId = req.userId;
    const paymentId = req.params.id;
    const body = req.body as VerifyPaymentInput;

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (paymentError || !payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    if (payment.status !== 'submitted') {
      return res.status(400).json({ success: false, message: 'Payment is not in submitted state' });
    }

    const { data: updatedPayment, error: updateError } = await supabase
      .from('payments')
      .update({
        status: body.status,
        verified_by: adminId,
        verified_at: new Date().toISOString(),
        verification_notes: body.verification_notes
      })
      .eq('id', paymentId)
      .select()
      .single();

    if (updateError) throw updateError;

    const newAdStatus = body.status === 'verified' ? 'payment_verified' : 'payment_pending';

    await supabase.from('ads').update({ status: newAdStatus }).eq('id', payment.ad_id);

    await supabase.from('ad_status_history').insert({
      ad_id: payment.ad_id,
      previous_status: 'payment_submitted',
      new_status: newAdStatus,
      changed_by: adminId,
      note: `Payment ${body.status} by admin`
    });

    return res.status(200).json({ success: true, data: updatedPayment });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
