import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ שגיאה: חסרים פרטי חיבור ל-Supabase!');
  console.error('📝 צור קובץ .env עם:');
  console.error('   SUPABASE_URL=...');
  console.error('   SUPABASE_SERVICE_KEY=...');
  process.exit(1);
}

// יצירת Supabase client עם service role key (גישה מלאה)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('✅ מחובר ל-Supabase בהצלחה!');

export default supabase;

