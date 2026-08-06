@echo off
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo.
  echo Node.js is not installed. Download: https://nodejs.org
  echo.
  pause
  exit /b 1
)

call "%~dp0stop-mobile.cmd"
node scripts/mobile-preview.mjs
echo.
pause
