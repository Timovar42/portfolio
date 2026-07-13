@echo off
cd /d "%~dp0"
echo Starting cake site at http://127.0.0.1:8765/
start "" "http://127.0.0.1:8765/"
npx --yes serve out -l 8765
