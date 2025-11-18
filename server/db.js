import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sqlite = sqlite3.verbose();

// יצירת חיבור למסד הנתונים
const db = new sqlite.Database(join(__dirname, '..', 'menu.db'), (err) => {
  if (err) {
    console.error('שגיאה בחיבור למסד הנתונים:', err);
  } else {
    console.log('✅ מחובר למסד הנתונים');
  }
});

// פונקציות עזר לשימוש עם promises
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// הפעלת foreign keys
db.run('PRAGMA foreign_keys = ON');

// יצירת הטבלאות
const initDB = async () => {
  try {
    // טבלת תפריטים (מספר תפריטים)
    await run(`
      CREATE TABLE IF NOT EXISTS menus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        logo_url TEXT,
        media_url TEXT,
        media_type TEXT DEFAULT 'image',
        theme_color TEXT DEFAULT '#1a1a1a',
        text_color TEXT DEFAULT '#ffffff',
        accent_color TEXT DEFAULT '#d4af37',
        font_family TEXT DEFAULT 'Assistant',
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // טבלת מוצרים (עם קשר לתפריט)
    await run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        menu_id INTEGER DEFAULT 1,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        image_url TEXT,
        category TEXT DEFAULT 'כללי',
        is_recommended INTEGER DEFAULT 0,
        order_index INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
      )
    `);

    // בדיקה אם יש תפריט ברירת מחדל, אם לא - יצירה
    const defaultMenu = await get('SELECT * FROM menus WHERE id = 1');
    if (!defaultMenu) {
      await run(`
        INSERT INTO menus (id, name, media_url, media_type, theme_color, text_color, accent_color, font_family)
        VALUES (1, 'תפריט ראשי', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'video', '#1a1a1a', '#ffffff', '#d4af37', 'Assistant')
      `);
      console.log('✅ נוצר תפריט ברירת מחדל עם וידאו דוגמה');
    }

    // הוספת מוצרי דוגמה אם הטבלה ריקה
    const productCount = await get('SELECT COUNT(*) as count FROM products');
    if (productCount.count === 0) {
      const sampleProducts = [
        { name: 'המבורגר בית', description: 'המבורגר עסיסי עם ירקות טריים ורטבים מיוחדים', price: 52, category: 'מנות עיקריות', is_recommended: 1, order_index: 1 },
        { name: 'פיצה מרגריטה', description: 'פיצה איטלקית קלאסית עם רטב עגבניות ומוצרלה', price: 48, category: 'מנות עיקריות', is_recommended: 0, order_index: 2 },
        { name: 'סלט קיסר', description: 'חסה רומית, קרוטונים, פרמזן ורטב קיסר ביתי', price: 38, category: 'סלטים', is_recommended: 0, order_index: 3 },
        { name: 'פסטה קרבונרה', description: 'פסטה עם רטב שמנת, בייקון ופרמזן', price: 56, category: 'מנות עיקריות', is_recommended: 1, order_index: 4 },
        { name: 'סטייק אנטריקוט', description: 'סטייק בשר בקר רך ועסיסי 300 גרם', price: 98, category: 'ספיישלים', is_recommended: 1, order_index: 5 },
        { name: 'שניצל עוף', description: 'שניצל עוף פריך עם תוספות', price: 45, category: 'מנות עיקריות', is_recommended: 0, order_index: 6 },
        { name: 'סלט יווני', description: 'עגבניות, מלפפון, זיתים, גבינת פטה', price: 36, category: 'סלטים', is_recommended: 0, order_index: 7 },
        { name: 'לימונדה ביתית', description: 'משקה מרענן מלימונים טריים ונענע', price: 18, category: 'שתייה', is_recommended: 0, order_index: 8 },
        { name: 'קולה', description: 'משקה קולה קר', price: 12, category: 'שתייה', is_recommended: 0, order_index: 9 },
        { name: 'עוגת שוקולד', description: 'עוגת שוקולד עשירה עם גנאש', price: 32, category: 'קינוחים', is_recommended: 1, order_index: 10 },
        { name: 'טירמיסו', description: 'קינוח איטלקי קלאסי', price: 38, category: 'קינוחים', is_recommended: 0, order_index: 11 },
        { name: 'פנקייק', description: 'פנקייק אמריקאי עם סירופ מייפל', price: 34, category: 'קינוחים', is_recommended: 0, order_index: 12 }
      ];

      for (const product of sampleProducts) {
        await run(
          'INSERT INTO products (menu_id, name, description, price, category, is_recommended, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [1, product.name, product.description, product.price, product.category, product.is_recommended, product.order_index]
        );
      }

      console.log('✅ נוספו מוצרי דוגמה למסד הנתונים');
    }

    console.log('✅ מסד הנתונים אותחל בהצלחה');
  } catch (error) {
    console.error('❌ שגיאה באתחול מסד הנתונים:', error);
  }
};

// אתחול מסד הנתונים
initDB();

export { db, run, get, all };
export default { db, run, get, all };

