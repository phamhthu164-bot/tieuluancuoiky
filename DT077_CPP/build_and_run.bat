@echo off
echo ========================================================
echo DANG BIEN DICH MA NGUON C++ (DT077 - PHAM HUYNH THU)
echo ========================================================
g++ -std=c++11 -Wall -O2 src/DeTai.cpp demo.cpp -o demo.exe
if %ERRORLEVEL% NEQ 0 (
    echo [LOI] Bien dich demo.cpp that bai!
    pause
    exit /b %ERRORLEVEL%
)

g++ -std=c++11 -Wall -O2 src/DeTai.cpp test_detai.cpp -o test_detai.exe
if %ERRORLEVEL% NEQ 0 (
    echo [LOI] Bien dich test_detai.cpp that bai!
    pause
    exit /b %ERRORLEVEL%
)

echo [THANH CONG] Bien dich thanh cong ca demo.exe va test_detai.exe!
echo.
echo ========================================================
echo 1. CHAY CHUONG TRINH MINH HOA (demo.exe)
echo ========================================================
.\demo.exe
echo.
echo ========================================================
echo 2. CHAY BO KIEM THU TU DONG (test_detai.exe)
echo ========================================================
.\test_detai.exe
echo.
echo HOAN TAT!
pause
