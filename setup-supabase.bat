@echo off
chcp 65001 > nul
color 0B
echo ════════════════════════════════════════════════════════
echo    MenuPro - Setup Supabase
echo ════════════════════════════════════════════════════════
echo.

cd /d "%~dp0"

echo [שלב 1/3] התקנת תלויות...
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
echo [שלב 2/3] יצירת קובץ .env
echo.

if exist .env (
    echo קובץ .env כבר קיים! ✓
) else (
    echo יוצר קובץ .env מהתבנית...
    copy .env.example .env >nul
    echo קובץ .env נוצר! ✓
    echo.
    echo ⚠️  חשוב! ערוך את קובץ .env והוסף את פרטי Supabase שלך:
    echo    1. SUPABASE_URL
    echo    2. SUPABASE_ANON_KEY
    echo    3. SUPABASE_SERVICE_KEY
    echo.
    echo 📝 מצא את הפרטים ב: https://supabase.com
    echo    Settings → API
)

echo.
echo ════════════════════════════════════════════════════════
echo    הוראות סיום
echo ════════════════════════════════════════════════════════
echo.
echo [שלב 3/3] מה עכשיו?
echo.
echo 1. פתח את Supabase: https://supabase.com
echo 2. צור פרויקט חדש (או פתח קיים)
echo 3. עבור ל-SQL Editor והרץ את הסקריפטים מ-SUPABASE_SETUP.md
echo 4. העתק את פרטי ה-API לקובץ .env
echo 5. הרץ: npm run dev
echo.
echo 📖 למידע מפורט, קרא: SUPABASE_INSTRUCTIONS.md
echo.
echo ════════════════════════════════════════════════════════

pause

