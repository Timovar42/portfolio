@echo off
if not exist "out\index.html" (
  echo Сначала выполните: npm run build
  pause
  exit /b 1
)
start "" "%~dp0out\index.html"
