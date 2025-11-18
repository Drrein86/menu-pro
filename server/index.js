import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import dbModule from './db.js';

const { db, run, get, all } = dbModule;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

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
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime', 'video/x-msvideo'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('סוג קובץ לא נתמך'));
    }
  }
});

// ===== API Routes =====

// ===== MENUS API =====

// 📌 קבלת כל התפריטים
app.get('/api/menus', async (req, res) => {
  try {
    const menus = await all('SELECT * FROM menus ORDER BY id ASC');
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 קבלת תפריט ספציפי
app.get('/api/menus/:id', async (req, res) => {
  try {
    const menu = await get('SELECT * FROM menus WHERE id = ?', [req.params.id]);
    if (!menu) {
      return res.status(404).json({ error: 'תפריט לא נמצא' });
    }
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 יצירת תפריט חדש
app.post('/api/menus', async (req, res) => {
  try {
    const { name, logo_url, media_url, media_type, theme_color, text_color, accent_color, font_family } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'שם התפריט הוא שדה חובה' });
    }
    
    const result = await run(`
      INSERT INTO menus (name, logo_url, media_url, media_type, theme_color, text_color, accent_color, font_family)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name,
      logo_url || null,
      media_url || null,
      media_type || 'image',
      theme_color || '#1a1a1a',
      text_color || '#ffffff',
      accent_color || '#d4af37',
      font_family || 'Assistant'
    ]);
    
    const newMenu = await get('SELECT * FROM menus WHERE id = ?', [result.lastID]);
    res.status(201).json(newMenu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 עדכון תפריט
app.put('/api/menus/:id', async (req, res) => {
  try {
    const { name, logo_url, media_url, media_type, theme_color, text_color, accent_color, font_family, is_active } = req.body;
    
    await run(`
      UPDATE menus 
      SET name = COALESCE(?, name),
          logo_url = COALESCE(?, logo_url),
          media_url = COALESCE(?, media_url),
          media_type = COALESCE(?, media_type),
          theme_color = COALESCE(?, theme_color),
          text_color = COALESCE(?, text_color),
          accent_color = COALESCE(?, accent_color),
          font_family = COALESCE(?, font_family),
          is_active = COALESCE(?, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, logo_url, media_url, media_type, theme_color, text_color, accent_color, font_family, is_active, req.params.id]);
    
    const updated = await get('SELECT * FROM menus WHERE id = ?', [req.params.id]);
    if (!updated) {
      return res.status(404).json({ error: 'תפריט לא נמצא' });
    }
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 מחיקת תפריט
app.delete('/api/menus/:id', async (req, res) => {
  try {
    // לא לאפשר מחיקת תפריט 1 (ברירת מחדל)
    if (req.params.id === '1') {
      return res.status(400).json({ error: 'לא ניתן למחוק את התפריט הראשי' });
    }
    
    const result = await run('DELETE FROM menus WHERE id = ?', [req.params.id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'תפריט לא נמצא' });
    }
    
    res.json({ success: true, message: 'התפריט נמחק בהצלחה' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 העלאת קובץ (לוגו/תמונת מוצר/וידאו)
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

// 📌 קבלת כל המוצרים (עם סינון לפי תפריט)
app.get('/api/products', async (req, res) => {
  try {
    const menuId = req.query.menu_id || 1;
    const products = await all('SELECT * FROM products WHERE menu_id = ? ORDER BY order_index ASC, id ASC', [menuId]);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 קבלת מוצר לפי ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!product) {
      return res.status(404).json({ error: 'מוצר לא נמצא' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 יצירת מוצר חדש
app.post('/api/products', async (req, res) => {
  try {
    const { menu_id, name, description, price, image_url, category, is_recommended } = req.body;
    
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'שם ומחיר הם שדות חובה' });
    }
    
    const menuIdToUse = menu_id || 1;
    
    // קבלת האינדקס הגבוה ביותר לתפריט זה
    const maxOrder = await get('SELECT MAX(order_index) as max FROM products WHERE menu_id = ?', [menuIdToUse]);
    const newOrderIndex = (maxOrder.max || 0) + 1;
    
    const result = await run(`
      INSERT INTO products (menu_id, name, description, price, image_url, category, is_recommended, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      menuIdToUse,
      name,
      description || null,
      price,
      image_url || null,
      category || 'כללי',
      is_recommended ? 1 : 0,
      newOrderIndex
    ]);
    
    const newProduct = await get('SELECT * FROM products WHERE id = ?', [result.lastID]);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 עדכון מוצר
app.put('/api/products/:id', async (req, res) => {
  try {
    const { name, description, price, image_url, category, is_recommended, order_index } = req.body;
    
    await run(`
      UPDATE products 
      SET name = COALESCE(?, name),
          description = COALESCE(?, description),
          price = COALESCE(?, price),
          image_url = COALESCE(?, image_url),
          category = COALESCE(?, category),
          is_recommended = COALESCE(?, is_recommended),
          order_index = COALESCE(?, order_index),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, description, price, image_url, category, is_recommended, order_index, req.params.id]);
    
    const updated = await get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!updated) {
      return res.status(404).json({ error: 'מוצר לא נמצא' });
    }
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 מחיקת מוצר
app.delete('/api/products/:id', async (req, res) => {
  try {
    const result = await run('DELETE FROM products WHERE id = ?', [req.params.id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'מוצר לא נמצא' });
    }
    
    res.json({ success: true, message: 'המוצר נמחק בהצלחה' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 עדכון סדר מוצרים (Drag & Drop)
app.put('/api/products/reorder', async (req, res) => {
  try {
    const { orders } = req.body; // [{ id, order_index }]
    
    for (const item of orders) {
      await run('UPDATE products SET order_index = ? WHERE id = ?', [item.order_index, item.id]);
    }
    
    res.json({ success: true, message: 'הסדר עודכן בהצלחה' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// בדיקת בריאות השרת
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// הפעלת השרת
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 API Documentation: http://localhost:${PORT}/api/health`);
});

