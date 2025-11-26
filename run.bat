@echo off
echo Ejecutando la prueba de carga de Login (20 TPS por 5 minutos)...
:: La ejecución apunta al script principal en la carpeta scenarios
k6 run scenarios\load_login.js

echo.
echo Prueba finalizada.
pause