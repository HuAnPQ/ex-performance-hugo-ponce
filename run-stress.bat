@echo off
echo Ejecutando la prueba de stress de Login (250 usuarios por 11m0s en 3 segmentos)...
:: La ejecución apunta al script principal en la carpeta scenarios
k6 run scenarios\stress_login.js

echo.
echo Prueba de stress finalizada.
pause