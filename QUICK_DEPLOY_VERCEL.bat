@echo off
chcp 65001 > nul
color 0C
echo ════════════════════════════════════════════════════════
echo    MenuPro - פריסה ל-Vercel
echo ════════════════════════════════════════════════════════
echo.

cd /d "%~dp0"

echo [בדיקה] האם Vercel CLI מותקן?
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo ✗ Vercel CLI לא מותקן!
    echo.
    echo מתקין Vercel CLI...
    call npm install -g vercel
    
    if %errorlevel% neq 0 (
        echo.
        echo ❌ שגיאה בהתקנת Vercel CLI!
        echo.
        echo נסה להתקין ידנית:
        echo npm install -g vercel
        pause
        exit /b 1
    )
    echo ✓ Vercel CLI הותקן בהצלחה!
) else (
    echo ✓ Vercel CLI מותקן!
)

echo.
echo ════════════════════════════════════════════════════════
echo    הוראות פריסה
echo ════════════════════════════════════════════════════════
echo.
echo [שלב 1] התחבר ל-Vercel:
echo   vercel login
echo.
echo [שלב 2] פרוס את הפרויקט:
echo   vercel
echo.
echo [שלב 3] הוסף משתני סביבה:
echo   vercel env add SUPABASE_URL
echo   vercel env add SUPABASE_ANON_KEY  
echo   vercel env add SUPABASE_SERVICE_KEY
echo.
echo [שלב 4] פרוס production:
echo   vercel --prod
echo.
echo ════════════════════════════════════════════════════════
echo.
echo רוצה שאני אעשה את זה עכשיו? [Y/N]
set /p CHOICE="הקלד Y להמשך או N ליציאה: "

if /i "%CHOICE%"=="Y" (
    echo.
    echo מתחבר ל-Vercel...
    call vercel login
    
    echo.
    echo פורס את הפרויקט...
    call vercel
    
    echo.
    echo ════════════════════════════════════════════════════════
    echo    הוספת משתני סביבה
    echo ════════════════════════════════════════════════════════
    echo.
    echo העתק והדבק את הערכים הבאים כשמתבקש:
    echo.
    echo SUPABASE_URL:
    echo https://lykcxbuxqanujqqalxsh.supabase.co
    echo.
    echo SUPABASE_ANON_KEY:
    echo eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5a2N4YnV4cWFudWpxcWFseHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NzgzMDQsImV4cCI6MjA3OTA1NDMwNH0.0TZeIUC2CvXbNWQucP1vbkAvixBlFA2B3UoaggqA7p4
    echo.
    echo SUPABASE_SERVICE_KEY:
    echo eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5a2N4YnV4cWFudWpxcWFseHNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQ3ODMwNCwiZXhwIjoyMDc5MDU0MzA0fQ.F6FwwGWdSvCu7cD-O3pOHbqvrY408JX3JDYUl6tm0V4
    echo.
    pause
    
    echo מוסיף SUPABASE_URL...
    call vercel env add SUPABASE_URL production
    
    echo מוסיף SUPABASE_ANON_KEY...
    call vercel env add SUPABASE_ANON_KEY production
    
    echo מוסיף SUPABASE_SERVICE_KEY...
    call vercel env add SUPABASE_SERVICE_KEY production
    
    echo.
    echo פורס production...
    call vercel --prod
    
    echo.
    echo ════════════════════════════════════════════════════════
    echo    הצלחה! ✓
    echo ════════════════════════════════════════════════════════
    echo.
    echo הפרויקט פורס ל-Vercel!
    echo בדוק את ה-URL שקיבלת למעלה.
    echo.
    echo Admin: https://your-url.vercel.app/admin
    echo Display: https://your-url.vercel.app/?menu=1
    echo.
)

echo.
echo 📖 למידע מפורט, קרא: DEPLOY_TO_VERCEL.md
echo.
pause

