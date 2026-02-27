@echo off
TITLE OnTv - Servidor Local
echo Iniciando el servidor de OnTv...
echo.

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado. Por favor, instalalo desde https://nodejs.org/
    pause
    exit /b
)

:: Start browser in 2 seconds
start "" "http://localhost:3000"

:: Start the server
echo Ejecutando servidor en el puerto 3000...
npx -y serve -l 3000 .
pause
