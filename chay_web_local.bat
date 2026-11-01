@echo off
echo ========================================================
echo   KHOI DONG WEB DEMO DT077 (LOCAL SERVER)
echo   Pham Huynh Thu - N24DCDT091 - DT077
echo ========================================================
echo.
echo [1] Dang mo trinh duyet...
start http://localhost:8000
echo.
echo [2] Dang chay Local Web Server tai cong 8000...
echo     Nhan Ctrl + C de dung server.
echo ========================================================
python -m http.server 8000 --directory "%~dp0web_app"
pause
