import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  try {
    // GET specific product
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'מוצר לא נמצא' });
      return res.status(200).json(data);
    }

    // PUT - Update product
    if (req.method === 'PUT') {
      const updateData = { ...req.body, updated_at: new Date().toISOString() };
      
      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'מוצר לא נמצא' });
      return res.status(200).json(data);
    }

    // DELETE - Delete product
    if (req.method === 'DELETE') {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return res.status(200).json({ success: true, message: 'המוצר נמחק בהצלחה' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
