import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // הערה: ב-Vercel צריך להשתמש ב-Supabase Storage או Cloudinary
    // כרגע נחזיר הודעה שצריך להעלות ל-URL חיצוני
    
    return res.status(200).json({
      message: 'השתמש ב-URL של תמונה חיצונית (Imgur, Cloudinary, וכו) או העלה ל-Supabase Storage',
      suggestion: 'https://supabase.com/docs/guides/storage'
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

