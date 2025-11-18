@echo off
chcp 65001 > nul
color 0D
cls
echo ════════════════════════════════════════════════════════
echo    MenuPro - תיקון Vercel צעד אחר צעד
echo ════════════════════════════════════════════════════════
echo.
echo קובץ זה יעזור לך לתקן את הבעיה עם Vercel
echo.
pause
echo.

cd /d "%~dp0"

echo ════════════════════════════════════════════════════════
echo    שלב 1/4: בדיקת קבצים
echo ════════════════════════════════════════════════════════
echo.
echo בודק אם כל הקבצים הנחוצים קיימים...
echo.

if not exist "vercel.json" (
    echo ❌ vercel.json חסר!
    echo זה קובץ קריטי לפריסה ב-Vercel
    pause
    exit /b 1
)
echo ✓ vercel.json קיים

if not exist "api\menus.js" (
    echo ❌ api\menus.js חסר!
    pause
    exit /b 1
)
echo ✓ api\menus.js קיים

if not exist "api\products.js" (
    echo ❌ api\products.js חסר!
    pause
    exit /b 1
)
echo ✓ api\products.js קיים

if not exist "client\src" (
    echo ❌ client\src חסר!
    pause
    exit /b 1
)
echo ✓ client\src קיים

echo.
echo ✅ כל הקבצים קיימים!
echo.
pause

echo ════════════════════════════════════════════════════════
echo    שלב 2/4: בדיקת GitHub
echo ════════════════════════════════════════════════════════
echo.
echo פותח את GitHub Repository שלך...
echo.
start https://github.com/Drrein86/menu-pro
echo.
echo ⚠️  חשוב! בדוק:
echo    1. האם הפרויקט קיים ב-GitHub?
echo    2. האם יש בו קבצים? (vercel.json, api/, client/, וכו')
echo.
echo אם אין קבצים או אין פרויקט - תצטרך להעלות:
echo    הרץ: upload-to-github-Drrein86.bat
echo.
set /p GITHUB_OK="האם הפרויקט ב-GitHub עם קבצים? (Y/N): "

if /i "%GITHUB_OK%" neq "Y" (
    echo.
    echo העלאה ל-GitHub...
    echo.
    call upload-to-github-Drrein86.bat
    if %errorlevel% neq 0 (
        echo.
        echo ❌ העלאה נכשלה!
        echo תצטרך להעלות ידנית דרך GitHub Desktop
        pause
        exit /b 1
    )
)

echo.
echo ✅ הפרויקט ב-GitHub!
echo.
pause

echo ════════════════════════════════════════════════════════
echo    שלב 3/4: פריסה ל-Vercel
echo ════════════════════════════════════════════════════════
echo.
echo פותח Vercel Dashboard...
echo.
start https://vercel.com/new
echo.
echo 📋 עכשיו עקוב אחרי ההוראות:
echo.
echo 1. אם מבקש התחברות - Login עם GitHub (Drrein86)
echo.
echo 2. בחר "Import Git Repository"
echo.
echo 3. בחר את: Drrein86/menu-pro
echo    (אם לא רואה - לחץ "Adjust GitHub App Permissions")
echo.
echo 4. הגדרות:
echo    Framework Preset: Other
echo    Build Command: cd client ^&^& npm install ^&^& npm run build
echo    Output Directory: client/dist
echo.
echo 5. Environment Variables - הוסף 3:
echo.
echo    SUPABASE_URL
echo    https://lykcxbuxqanujqqalxsh.supabase.co
echo.
echo    SUPABASE_ANON_KEY
echo    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5a2N4YnV4cWFudWpxcWFseHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NzgzMDQsImV4cCI6MjA3OTA1NDMwNH0.0TZeIUC2CvXbNWQucP1vbkAvixBlFA2B3UoaggqA7p4
echo.
echo    SUPABASE_SERVICE_KEY
echo    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5a2N4YnV4cWFudWpxcWFseHNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQ3ODMwNCwiZXhwIjoyMDc5MDU0MzA0fQ.F6FwwGWdSvCu7cD-O3pOHbqvrY408JX3JDYUl6tm0V4
echo.
echo 6. לחץ "Deploy"
echo.
echo 7. המתן 3-5 דקות
echo.
pause
echo.

echo ════════════════════════════════════════════════════════
echo    שלב 4/4: בדיקת הפריסה
echo ════════════════════════════════════════════════════════
echo.
echo פותח Vercel Dashboard...
start https://vercel.com/dashboard
echo.
echo ⚠️  בדוק:
echo.
echo 1. האם יש פרויקט "menu-pro"?
echo 2. מה הסטטוס?
echo    - Ready (ירוק) = הכל תקין! ✅
echo    - Error (אדום) = יש בעיה ❌
echo    - Building (צהוב) = ממתין...
echo.
echo 3. לחץ על הפרויקט
echo 4. העתק את ה-URL (משהו כמו: menu-pro-xxx.vercel.app)
echo.
set /p VERCEL_URL="הדבק את ה-URL כאן (או Enter אם יש שגיאה): "

if "%VERCEL_URL%"=="" (
    echo.
    echo נראה שיש בעיה בפריסה
    echo.
    echo פתח את Function Logs כדי לראות את השגיאה
    echo Vercel Dashboard -^> הפרויקט -^> Deployments -^> View Function Logs
    echo.
    pause
    exit /b 0
)

echo.
echo ════════════════════════════════════════════════════════
echo    בודק את האתר...
echo ════════════════════════════════════════════════════════
echo.
echo פותח את האתר שלך...
echo.

if not "%VERCEL_URL:~0,7%"=="http://" (
    if not "%VERCEL_URL:~0,8%"=="https://" (
        set "VERCEL_URL=https://%VERCEL_URL%"
    )
)

start %VERCEL_URL%/admin
echo.
echo פתחתי את דף הניהול: %VERCEL_URL%/admin
echo.
echo אם זה עובד - מזל טוב! ✅
echo אם לא - תגיד לי מה השגיאה ואני אעזור
echo.
echo ════════════════════════════════════════════════════════
pause

