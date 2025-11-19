-- תיקון כל השגיאות וה הוספת שדות חדשים
-- הרץ את זה ב-Supabase SQL Editor: https://supabase.com/dashboard/project/lykcxbuxqanujqqalxsh/sql/new

-- 1. הוספת שדות חסרים
ALTER TABLE menus 
ADD COLUMN IF NOT EXISTS video_zoom DECIMAL(3,1) DEFAULT 2.0,
ADD COLUMN IF NOT EXISTS business_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS business_slogan VARCHAR(500);

-- 2. עדכון תפריטים קיימים עם ערכי ברירת מחדל
UPDATE menus 
SET 
  video_zoom = COALESCE(video_zoom, 2.0),
  business_name = COALESCE(business_name, name),
  business_slogan = COALESCE(business_slogan, 'ברוכים הבאים')
WHERE id IS NOT NULL;

-- 3. בדיקה שהכל עבד
SELECT 
  id, 
  name,
  business_name,
  business_slogan,
  video_zoom,
  logo_url IS NOT NULL as has_logo,
  media_url IS NOT NULL as has_media
FROM menus;

-- ✅ אם רואה את כל השדות - הצלחת!
-- ✅ עכשיו אפשר לשמור שינויים באדמין ללא שגיאת 500

