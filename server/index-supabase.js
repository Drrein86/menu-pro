import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import supabase from './supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// יצירת תיקיית uploads אם לא קיימת
const uploadsDir = join(__dirname, '..', 'uploads');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir);
}

// הגשת קבצים סטטיים
app.use('/uploads', express.static(uploadsDir));

// הגדרת multer להעלאת קבצים
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime', 'video/x-msvideo'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('סוג קובץ לא נתמך'));
    }
  }
});

// ===== MENUS API =====

// קבלת כל התפריטים
app.get('/api/menus', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// קבלת תפריט ספציפי
app.get('/api/menus/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'תפריט לא נמצא' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// יצירת תפריט חדש
app.post('/api/menus', async (req, res) => {
  try {
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
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// עדכון תפריט
app.put('/api/menus/:id', async (req, res) => {
  try {
    const updateData = { ...req.body, updated_at: new Date().toISOString() };
    
    const { data, error } = await supabase
      .from('menus')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'תפריט לא נמצא' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// מחיקת תפריט
app.delete('/api/menus/:id', async (req, res) => {
  try {
    if (req.params.id === '1') {
      return res.status(400).json({ error: 'לא ניתן למחוק את התפריט הראשי' });
    }
    
    const { error } = await supabase
      .from('menus')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;
    res.json({ success: true, message: 'התפריט נמחק בהצלחה' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== PRODUCTS API =====

// קבלת כל המוצרים (עם סינון לפי תפריט)
app.get('/api/products', async (req, res) => {
  try {
    const menuId = req.query.menu_id || 1;
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('menu_id', menuId)
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// קבלת מוצר לפי ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'מוצר לא נמצא' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// יצירת מוצר חדש
app.post('/api/products', async (req, res) => {
  try {
    const { menu_id, name, description, price, image_url, category, is_recommended } = req.body;
    
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'שם ומחיר הם שדות חובה' });
    }
    
    const menuIdToUse = menu_id || 1;
    
    // קבלת האינדקס הגבוה ביותר
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
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// עדכון מוצר
app.put('/api/products/:id', async (req, res) => {
  try {
    const updateData = { ...req.body, updated_at: new Date().toISOString() };
    
    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'מוצר לא נמצא' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// מחיקת מוצר
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;
    res.json({ success: true, message: 'המוצר נמחק בהצלחה' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// עדכון סדר מוצרים
app.put('/api/products/reorder', async (req, res) => {
  try {
    const { orders } = req.body;
    
    for (const item of orders) {
      await supabase
        .from('products')
        .update({ order_index: item.order_index })
        .eq('id', item.id);
    }
    
    res.json({ success: true, message: 'הסדר עודכן בהצלחה' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// העלאת קובץ
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'לא הועלה קובץ' });
    }
    
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl, filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// בדיקת בריאות השרת
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running with Supabase',
    database: 'Supabase PostgreSQL'
  });
});

// הפעלת השרת
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`💾 Database: Supabase`);
  console.log(`📊 API: http://localhost:${PORT}/api/health`);
});

