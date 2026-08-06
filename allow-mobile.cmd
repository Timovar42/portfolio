@echo off
cd /d "%~dp0"

net session >nul 2>&1
if errorlevel 1 (
  echo.
  echo Run as Administrator: right-click allow-mobile.cmd
  echo.
  pause
  exit /b 1
)

for %%P in (8080 8090 8091 8092 8093) do (
  netsh advfirewall firewall delete rule name="Portfolio Mobile Preview %%P" >nul 2>&1
  netsh advfirewall firewall add rule name="Portfolio Mobile Preview %%P" dir=in action=allow protocol=TCP localport=%%P profile=any enable=yes >nul
)

echo.
echo Done. Firewall opened for ports 8080-8093 on ALL network types.
echo Now run start-mobile.cmd
echo.
pause
