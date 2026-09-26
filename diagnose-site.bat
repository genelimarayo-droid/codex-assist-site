@echo off
title Codex Site Diagnostic
cd /d "%~dp0"
echo Running diagnostics in:
echo %CD%
echo.
echo Node:
node -v
echo.
echo npm:
npm -v
echo.
echo package.json:
if exist package.json (type package.json) else (echo NOT FOUND)
echo.
echo Port 5173:
netstat -ano | findstr :5173
echo.
echo Git status:
git status --short
echo.
echo Recent commits:
git log --oneline -10
echo.
echo Press any key to close.
pause >nul
