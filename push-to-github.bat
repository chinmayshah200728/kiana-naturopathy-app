@echo off
echo ========================================================
echo Pushing Kiana Naturopathy Code to GitHub...
echo Repository: https://github.com/chinmayshah200728/kiana-naturopathy-app
echo ========================================================
cd /d "%~dp0"
git branch -M main
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Code pushed to GitHub successfully!
) else (
    echo [NOTE] If you saw a login prompt, complete it in your browser.
    echo If repository was not found, make sure you created 'kiana-naturopathy-app' on https://github.com/new first!
)
pause
