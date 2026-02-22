@echo off
echo ==========================================
echo    Starting Unified Grievance Portal
echo ==========================================

echo Starting Backend Server...
start "GovTech Server" cmd /k "cd server && npm run dev"

echo Waiting for Server to Initialize...
timeout /t 5

echo Starting Client Application...
start "GovTech Client" cmd /k "cd client && npm run dev"

echo Waiting for Client...
timeout /t 5

echo Launching Browser...
start http://localhost:5173

echo ==========================================
echo    System is Live!
echo ==========================================
pause
