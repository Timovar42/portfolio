@echo off
cd /d "%~dp0"

for %%P in (8080 8090 8091 8092 8093) do (
  for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%%P " ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
  )
)

echo Old servers stopped.
