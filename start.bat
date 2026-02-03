@echo off
SETLOCAL EnableDelayedExpansion

echo ==========================================
echo   Expense Manager - Startup Script
echo ==========================================

:: Step 1: Check Prerequisite - Node.js
echo [1/4] Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    exit /b 1
)
call node -v

:: Step 2: Check Prerequisite - pnpm
echo [2/4] Checking pnpm...
where pnpm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] pnpm is not installed. Please install it with 'npm install -g pnpm'.
    exit /b 1
)
call pnpm -v

:: Step 3: Check Prerequisite - Docker
echo [3/4] Checking Docker...
call docker info >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Docker is not running or not installed. Please start Docker Desktop.
    exit /b 1
)
echo Docker is running.

:: Step 4: Start Components
echo [4/4] Starting components...

:: Start Database
echo Starting database (Docker)...
call docker-compose up -d

:: Start Backend in new window
echo Starting NestJS Backend (Server)...
start "NestJS Backend" cmd /k "pnpm -C server start:dev"

:: Start Frontend in new window
echo Starting Vite Frontend (Client)...
start "Vite Frontend" cmd /k "pnpm -C client dev"

echo.
echo ==========================================
echo   All components are starting!
echo   - Backend: http://localhost:3000
echo   - Frontend: http://localhost:5173
echo ==========================================
pause
