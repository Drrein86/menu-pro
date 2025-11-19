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
    // Extract ID from URL path or query
    let id = null;
    
    // Check query parameter first
    if (req.query && req.query.id) {
      id = req.query.id;
    } else {
      // Extract from URL path
      const urlParts = req.url.split('/').filter(Boolean);
      const lastPart = urlParts[urlParts.length - 1].split('?')[0];
      if (lastPart && lastPart !== 'products' && !isNaN(lastPart)) {
        id = lastPart;
      }
    }
    
    const hasId = id && !isNaN(id);
    
    // Extract query params
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const menu_id = urlObj.searchParams.get('menu_id');

    // GET all products (with menu filter)
    if (req.method === 'GET' && !hasId) {
      const menuId = menu_id || 1;
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('menu_id', menuId)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return res.status(200).json(data);
    }

    // GET specific product
    if (req.method === 'GET' && hasId) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'מוצר לא נמצא' });
      return res.status(200).json(data);
    }

    // POST - Create new product
    if (req.method === 'POST') {
      const { menu_id, name, description, price, image_url, category, is_recommended } = req.body;
      
      if (!name || price === undefined) {
        return res.status(400).json({ error: 'שם ומחיר הם שדות חובה' });
      }
      
      const menuIdToUse = menu_id || 1;
      
      // Get max order_index
      const { data: maxData } = await supabase
        .from('products')
        .select('order_index')
        .eq('menu_id', menuIdToUse)
        .order('order_index', { ascending: false })
        .limit(1)
        .single();
      
      const newOrderIndex = (maxData?.order_index || 0) + 1;
      
      const { data, error } = await supabase
        .from('products')
        .insert([{
          menu_id: menuIdToUse,
          name,
          description: description || null,
          price,
          image_url: image_url || null,
          category: category || 'כללי',
          is_recommended: is_recommended ? 1 : 0,
          order_index: newOrderIndex
        }])
        .select()
        .single();
      
      if (error) throw error;
      return res.status(201).json(data);
    }

    // PUT - Update product
    if (req.method === 'PUT' && hasId) {
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
    if (req.method === 'DELETE' && hasId) {
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

