import dotenv from 'dotenv';
import path from 'path';

// First load local server env if exists
let envResult = dotenv.config();

// Fallback to workspace root .env if missing SUPABASE_URL
if (!process.env.SUPABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}
