@echo off
chcp 65001 > nul
echo ====================================
echo MenuPro - העלאה ל-GitHub
echo ====================================
echo.

set /p USERNAME="הזן את שם המשתמש שלך ב-GitHub: "
set /p REPONAME="הזן את שם ה-Repository (לדוגמה: menu-pro): "

echo.
echo מתחבר ל-GitHub...
echo.

git remote remove origin 2>nul
git remote add origin https://github.com/%USERNAME%/%REPONAME%.git

echo.
echo מעלה את הקבצים...
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ====================================
    echo הצלחה! הפרויקט הועלה ל-GitHub
    echo.
    echo גש ל: https://github.com/%USERNAME%/%REPONAME%
    echo ====================================
) else (
    echo.
    echo ====================================
    echo שגיאה בהעלאה!
    echo.
    echo אם GitHub ביקש סיסמה:
    echo 1. צור Personal Access Token ב-GitHub
    echo 2. גש ל: https://github.com/settings/tokens
    echo 3. Generate new token (classic)
    echo 4. סמן: repo
    echo 5. השתמש ב-token במקום סיסמה
    echo ====================================
)

echo.
pause

