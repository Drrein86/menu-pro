import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Extract ID from URL path if present (e.g., /api/menus/1)
    const urlParts = req.url.split('/');
    const id = urlParts[urlParts.length - 1].split('?')[0];
    const hasId = id && id !== 'menus' && !isNaN(id);

    // GET all menus
    if (req.method === 'GET' && !hasId) {
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      return res.status(200).json(data);
    }

    // GET specific menu
    if (req.method === 'GET' && hasId) {
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'תפריט לא נמצא' });
      return res.status(200).json(data);
    }

    // POST - Create new menu
    if (req.method === 'POST') {
      const { name, logo_url, media_url, media_type, theme_color, text_color, accent_color, font_family } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'שם התפריט הוא שדה חובה' });
      }
      
      const { data, error } = await supabase
        .from('menus')
        .insert([{
          name,
          logo_url: logo_url || null,
          media_url: media_url || null,
          media_type: media_type || 'image',
          theme_color: theme_color || '#1a1a1a',
          text_color: text_color || '#ffffff',
          accent_color: accent_color || '#d4af37',
          font_family: font_family || 'Assistant'
        }])
        .select()
        .single();
      
      if (error) throw error;
      return res.status(201).json(data);
    }

    // PUT - Update menu
    if (req.method === 'PUT' && hasId) {
      const updateData = { ...req.body, updated_at: new Date().toISOString() };
      
      const { data, error } = await supabase
        .from('menus')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'תפריט לא נמצא' });
      return res.status(200).json(data);
    }

    // DELETE - Delete menu
    if (req.method === 'DELETE' && hasId) {
      if (id === '1') {
        return res.status(400).json({ error: 'לא ניתן למחוק את התפריט הראשי' });
      }
      
      const { error } = await supabase
        .from('menus')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return res.status(200).json({ success: true, message: 'התפריט נמחק בהצלחה' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

