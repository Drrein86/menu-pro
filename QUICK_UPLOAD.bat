@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════╗
echo ║   🚀 העלאה מהירה ל-GitHub + Vercel    ║
echo ╚════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo [1/4] מוסיף קבצים...
git add .

echo [2/4] יוצר commit...
git commit -m "Fixed 500 error, removed footer, added business name and slogan, added admin scrolling"

echo [3/4] דוחף ל-GitHub...
git push

echo.
echo ✅ הקבצים עלו!
echo.
echo ⏳ כעת Vercel יעשה Deploy אוטומטית...
echo 📺 המתן 2-3 דקות ורענן את: https://menu-pro-eight.vercel.app/?menu=1
echo.
pause

