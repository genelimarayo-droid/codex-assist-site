@echo off
cd /d "%~dp0"
set "OUT=diagnostic-report.txt"
(
  echo === DATE ===
  date /t
  time /t
  echo === FILES ===
  dir /b /a
  echo === NODE ===
  node -v
  echo === NPM ===
  npm -v
  echo === PNPM ===
  pnpm -v
  echo === YARN ===
  yarn -v
  echo === PACKAGE ===
  type package.json
  echo === GIT STATUS ===
  git status --short
  echo === GIT LOG ===
  git log --oneline -10
  echo === PORT 5173 ===
  netstat -ano | findstr :5173
) > "%OUT%" 2>&1
start notepad "%OUT%"
