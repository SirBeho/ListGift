@echo off
title ListGift Runner (MODO NATIVO WIFI)
color 0B

echo ===========================================
echo    LIMPIANDO PROCESOS...
echo ===========================================
taskkill /F /IM php.exe >nul 2>&1
taskkill /F /IM ngrok.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1

echo.
echo ===========================================
echo    INICIANDO EN RED LOCAL (SIN NGROK)
echo ===========================================

:: 1. BACKEND PHP
:: Escucha en 0.0.0.0 para que el celular lo vea
echo [1/2] Iniciando Backend (Puerto 8000)...
start "BACKEND - PHP" cmd /k "color 0A && cd /d "%~dp0backend" && php -S 0.0.0.0:8000 -t public -d display_errors=On -d error_reporting=E_ALL -d error_log=/dev/stderr"

:: 2. FRONTEND REACT
:: --host permite que el celular entre
echo [2/2] Iniciando Frontend (Puerto 5173)...
start "FRONTEND - REACT" cmd /k "color 0E && cd /d "%~dp0frontend" && npm run dev -- --host"

echo.
echo ========================================================
echo    TODO LISTO - INSTRUCCIONES:
echo.
echo    1. En tu celular (Chrome):
echo       Entra a: http://192.168.100.134:5173
echo.
echo    2. SI LAS NOTIFICACIONES FALLAN:
echo       Ve a chrome://flags en el celular.
echo       Busca "Insecure origins treated as secure".
echo       Añade: http://192.168.100.134:5173
echo       Reinicia Chrome.
echo ========================================================
pause