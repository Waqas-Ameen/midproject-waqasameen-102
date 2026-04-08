const cron = require('node-cron');
const { supabase } = require('../index');

const start = () => {
  // Publish scheduled ads (run every hour)
  cron.schedule('0 * * * *', async () => {
    try {
      const now = new Date().toISOString();
      const { data: ads, error } = await supabase
        .from('ads')
        .update({ status: 'published' })
        .eq('status', 'scheduled')
        .lte('publish_at', now);

      if (error) console.error('Publish cron error:', error);
      else console.log(`Published ${ads.length} ads`);
    } catch (error) {
      console.error('Publish cron error:', error);
    }
  });

  // Expire ads (run daily at midnight)
  cron.schedule('0 0 * * *', async () => {
    try {
      const now = new Date().toISOString();
      const { data: ads, error } = await supabase
        .from('ads')
        .update({ status: 'expired' })
        .eq('status', 'published')
        .lt('expiry_date', now);

      if (error) console.error('Expire cron error:', error);
      else console.log(`Expired ${ads.length} ads`);
    } catch (error) {
      console.error('Expire cron error:', error);
    }
  });

  // Send expiry reminders (run daily)
  cron.schedule('0 9 * * *', async () => {
    try {
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

      const { data: ads, error } = await supabase
        .from('ads')
        .select('id, user_id, title, expiry_date')
        .eq('status', 'published')
        .lte('expiry_date', threeDaysFromNow.toISOString())
        .gt('expiry_date', new Date().toISOString());

      if (error) throw error;

      for (const ad of ads) {
        await supabase.from('notifications').insert([{
          user_id: ad.user_id,
          message: `Your ad "${ad.title}" expires on ${new Date(ad.expiry_date).toDateString()}`,
          type: 'reminder'
        }]);
      }

      console.log(`Sent ${ads.length} expiry reminders`);
    } catch (error) {
      console.error('Reminder cron error:', error);
    }
  });

  console.log('Cron jobs started');
};

module.exports = { start };