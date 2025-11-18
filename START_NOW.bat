@echo off
chcp 65001 > nul
color 0E
echo ════════════════════════════════════════════════════════
echo    MenuPro - הפעלה מהירה
echo ════════════════════════════════════════════════════════
echo.

cd /d "%~dp0"

echo [בדיקה] האם קובץ .env קיים?
if exist .env (
    echo ✓ קובץ .env קיים!
    echo.
) else (
    echo ✗ קובץ .env לא נמצא!
    echo.
    echo יוצר קובץ .env...
    
    echo SUPABASE_URL=https://lykcxbuxqanujqqalxsh.supabase.co > .env
    echo SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5a2N4YnV4cWFudWpxcWFseHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NzgzMDQsImV4cCI6MjA3OTA1NDMwNH0.0TZeIUC2CvXbNWQucP1vbkAvixBlFA2B3UoaggqA7p4 >> .env
    echo SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5a2N4YnV4cWFudWpxcWFseHNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQ3ODMwNCwiZXhwIjoyMDc5MDU0MzA0fQ.F6FwwGWdSvCu7cD-O3pOHbqvrY408JX3JDYUl6tm0V4 >> .env
    echo PORT=3000 >> .env
    echo NODE_ENV=development >> .env
    
    echo ✓ קובץ .env נוצר בהצלחה!
    echo.
)

echo [שלב 1/2] התקנת תלויות...
echo.
call npm install

if %errorlevel% neq 0 (
    echo.
    echo ❌ שגיאה בהתקנת תלויות!
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════════
echo    התקנה הושלמה! ✓
echo ════════════════════════════════════════════════════════
echo.

echo [שלב 2/2] הפעלת המערכת...
echo.
echo 🚀 המערכת עולה...
echo.
echo ➜  Admin Panel:  http://localhost:5173/admin
echo ➜  תפריט:        http://localhost:5173/?menu=1
echo.
echo לעצירה: לחץ Ctrl+C
echo.
echo ════════════════════════════════════════════════════════
echo.

npm run dev

