@echo off
setlocal
cd /d "%~dp0"

@echo off
setlocal
cd /d "%~dp0"
set "LOG=%~dp0start-site.log"
echo [%date% %time%] Starting Codex site > "%LOG%"
set "BUNDLED_NODE=C:\Users\80904\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if exist "%BUNDLED_NODE%" if exist "%~dp0local-server.cjs" goto bundled
where pnpm >nul 2>nul && if exist "%~dp0node_modules\vite\bin\vite.js" goto pnpm
where npm >nul 2>nul && if exist "%~dp0node_modules\vite\bin\vite.js" goto npm
where py >nul 2>nul && goto python
where python >nul 2>nul && goto python
echo Node/Vite/Python was not found. Install Node.js LTS, then run npm install.>> "%LOG%"
echo Cannot start the site. See start-site.log.
pause
exit /b 1

:bundled
echo Using bundled Node: %BUNDLED_NODE%>> "%LOG%"
start "Codex Assist Server" /D "%~dp0" "%BUNDLED_NODE%" "%~dp0local-server.cjs"
goto open

:pnpm
start "Codex Assist Server" /D "%~dp0" pnpm exec vite --host 0.0.0.0 --port 5173
goto open

:npm
start "Codex Assist Server" /D "%~dp0" npm exec vite -- --host 0.0.0.0 --port 5173
goto open

:python
echo Using Python static server fallback.>> "%LOG%"
where py >nul 2>nul
if not errorlevel 1 (
  start "Codex Assist Server" /D "%~dp0" py -m http.server 5173
) else (
  start "Codex Assist Server" /D "%~dp0" python -m http.server 5173
)

:open
timeout /t 4 /nobreak >nul
start "" "http://127.0.0.1:5173/"
echo Site startup requested. If the page does not open, inspect start-site.log.
exit /b 0

where pnpm >nul 2>nul
if %errorlevel%==0 (
  start "" "http://127.0.0.1:5173/"
  call pnpm dev
  exit /b %errorlevel%
)

where npm >nul 2>nul
if %errorlevel%==0 (
  if not exist node_modules call npm install
  start "" "http://127.0.0.1:5173/"
  call npm run dev
  exit /b %errorlevel%
)

echo Node.js is not installed or is not available in PATH.
echo Install Node.js, then double-click this file again.
pause
