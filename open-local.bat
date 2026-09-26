@echo off
title Codex Local Server
cd /d "%~dp0"
set "NODE=C:\Users\80904\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if exist "%NODE%" goto run_bundled
where node >nul 2>nul
if not errorlevel 1 goto run_system
where py >nul 2>nul
if not errorlevel 1 goto run_python
where python >nul 2>nul
if not errorlevel 1 goto run_python2
echo No Node.js or Python runtime was found.
echo Install Node.js LTS from https://nodejs.org/ and run this file again.
pause
exit /b 1

:run_bundled
echo Starting local server with bundled Node at http://127.0.0.1:5173/
start "Codex Site" "http://127.0.0.1:5173/"
"%NODE%" "%~dp0local-server.cjs"
goto done

:run_system
echo Starting local server with system Node at http://127.0.0.1:5173/
start "Codex Site" "http://127.0.0.1:5173/"
node "%~dp0local-server.cjs"
goto done

:run_python
echo Starting local server with Python at http://127.0.0.1:5173/
start "Codex Site" "http://127.0.0.1:5173/"
py -m http.server 5173
goto done

:run_python2
echo Starting local server with Python at http://127.0.0.1:5173/
start "Codex Site" "http://127.0.0.1:5173/"
python -m http.server 5173

:done
echo.
echo Server stopped. Press any key to close.
pause >nul
