# 🔗 חיבור MenuPro ל-Supabase

## שלב 1: צור פרויקט ב-Supabase (5 דקות)

1. **גש ל**: https://supabase.com
2. **לחץ**: "Start your project"
3. **התחבר** עם GitHub (Drrein86)
4. **צור ארגון חדש** או בחר קיים
5. **New project**:
   - Name: `menu-pro`
   - Database Password: **שמור את הסיסמה!** 🔑
   - Region: בחר הכי קרוב (Europe West או US East)
   - Plan: **Free** ✅
6. **לחץ**: "Create new project"
7. **המתן** 2-3 דקות שהפרויקט ייווצר

---

## שלב 2: העתק את פרטי החיבור

בפרויקט שנוצר:

1. **לחץ** על אייקון ה-⚙️ (Settings) בצד שמאל
2. **לחץ** על "API"
3. **העתק והשמור**:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbG...` (מפתח ארוך)
   - **service_role key**: `eyJhbG...` (מפתח ארוך אחר)

4. **לחץ** על "Database" בצד
5. **לחץ** על "Connection string" → "URI"
6. **העתק**: `postgresql://postgres:[YOUR-PASSWORD]@...`
7. **החלף** `[YOUR-PASSWORD]` בסיסמה שהגדרת!

---

## שלב 3: צור את הטבלאות ב-Supabase

1. **לחץ** על 🗂️ "Table Editor" בצד שמאל
2. **לחץ** על "New table"

### טבלה 1: menus

```sql
-- בלשונית SQL Editor, הרץ:
CREATE TABLE menus (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  media_url TEXT,
  media_type TEXT DEFAULT 'image',
  theme_color TEXT DEFAULT '#1a1a1a',
  text_color TEXT DEFAULT '#ffffff',
  accent_color TEXT DEFAULT '#d4af37',
  font_family TEXT DEFAULT 'Assistant',
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- הוסף תפריט ברירת מחדל
INSERT INTO menus (id, name, theme_color, text_color, accent_color, font_family)
VALUES (1, 'תפריט ראשי', '#1a1a1a', '#ffffff', '#d4af37', 'Assistant');
```

### טבלה 2: products

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  menu_id INTEGER DEFAULT 1 REFERENCES menus(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  image_url TEXT,
  category TEXT DEFAULT 'כללי',
  is_recommended INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- הוסף מוצרי דוגמה
INSERT INTO products (menu_id, name, description, price, category, is_recommended, order_index)
VALUES 
  (1, 'המבורגר בית', 'המבורגר עסיסי עם ירקות טריים ורטבים מיוחדים', 52, 'מנות עיקריות', 1, 1),
  (1, 'פיצה מרגריטה', 'פיצה איטלקית קלאסית עם רטב עגבניות ומוצרלה', 48, 'מנות עיקריות', 0, 2),
  (1, 'סלט קיסר', 'חסה רומית, קרוטונים, פרמזן ורטב קיסר ביתי', 38, 'סלטים', 0, 3),
  (1, 'פסטה קרבונרה', 'פסטה עם רטב שמנת, בייקון ופרמזן', 56, 'מנות עיקריות', 1, 4),
  (1, 'עוגת שוקולד', 'עוגת שוקולד עשירה עם גנאש', 32, 'קינוחים', 1, 5);
```

**לחץ RUN!** ✅

---

## שלב 4: עכשיו אני אעדכן את הקוד

המתן רגע...

