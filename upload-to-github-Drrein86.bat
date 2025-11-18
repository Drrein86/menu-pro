@echo off
chcp 65001 > nul
color 0A
echo ════════════════════════════════════════════════════════
echo    MenuPro - Upload to GitHub
echo    User: Drrein86
echo ════════════════════════════════════════════════════════
echo.

cd /d "%~dp0"

echo [1/5] Initializing Git...
git init
if %errorlevel% neq 0 (
    echo ERROR: Git init failed!
    pause
    exit /b 1
)

echo [2/5] Configuring Git...
git config user.name "Drrein86"
git config user.email "drrein86@users.noreply.github.com"

echo [3/5] Adding files...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Git add failed!
    pause
    exit /b 1
)

echo [4/5] Creating commit...
git commit -m "Initial commit: MenuPro v2.0 - Multi-menu digital display system"
if %errorlevel% neq 0 (
    echo ERROR: Git commit failed!
    pause
    exit /b 1
)

echo [5/5] Setting branch to main...
git branch -M main

echo.
echo ════════════════════════════════════════════════════════
echo    Git Setup Complete! ✓
echo ════════════════════════════════════════════════════════
echo.
echo Now connecting to GitHub...
echo Repository: https://github.com/Drrein86/menu-pro
echo.

git remote remove origin 2>nul
git remote add origin https://github.com/Drrein86/menu-pro.git

echo Pushing to GitHub...
echo.
echo ** You will need to enter your GitHub credentials **
echo Username: Drrein86
echo Password: Use your Personal Access Token (not password!)
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ════════════════════════════════════════════════════════
    echo    SUCCESS! Project uploaded to GitHub! ✓
    echo ════════════════════════════════════════════════════════
    echo.
    echo View your project at:
    echo https://github.com/Drrein86/menu-pro
    echo.
    echo Share this link with anyone you want!
    echo ════════════════════════════════════════════════════════
) else (
    echo.
    echo ════════════════════════════════════════════════════════
    echo    Upload Failed - Authentication Required
    echo ════════════════════════════════════════════════════════
    echo.
    echo You need a Personal Access Token from GitHub:
    echo.
    echo 1. Go to: https://github.com/settings/tokens
    echo 2. Click: Generate new token ^(classic^)
    echo 3. Name: MenuPro Upload
    echo 4. Select: ✓ repo ^(all checkboxes^)
    echo 5. Click: Generate token
    echo 6. COPY the token ^(you won't see it again!^)
    echo 7. Run this file again
    echo 8. When asked for password, PASTE the token
    echo.
    echo ════════════════════════════════════════════════════════
)

echo.
pause

