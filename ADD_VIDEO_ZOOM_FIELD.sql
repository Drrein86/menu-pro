-- הוספת שדה video_zoom לטבלת menus
-- הרץ את זה ב-Supabase SQL Editor

ALTER TABLE menus 
ADD COLUMN IF NOT EXISTS video_zoom DECIMAL(3,1) DEFAULT 2.0;

-- עדכון תפריט קיים לערך ברירת מחדל
UPDATE menus 
SET video_zoom = 2.0 
WHERE video_zoom IS NULL;

-- הצג את כל התפריטים עם הזום החדש
SELECT id, name, video_zoom FROM menus;

