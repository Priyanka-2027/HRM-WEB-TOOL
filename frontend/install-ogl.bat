@echo off
echo Installing ogl library for Prism background...
cd D:\Hironix\frontend
call npm install ogl
echo.
echo Installation complete!
echo.
echo Now restart your dev server:
echo 1. Stop the current server (Ctrl+C in the terminal running npm run dev)
echo 2. Run: npm run dev
echo 3. Refresh your browser
echo.
pause
