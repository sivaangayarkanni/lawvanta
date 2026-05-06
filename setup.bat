@echo off
echo 🚀 Setting up Lawvanta...
echo.

REM Install root dependencies
echo 📦 Installing root dependencies...
call npm install

REM Install shared dependencies and build
echo 📦 Installing shared dependencies...
cd shared
call npm install
call npm run build
cd ..

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install

REM Create data directory
if not exist "data" mkdir data

REM Seed database
echo 🌱 Seeding database with demo data...
node src/scripts/seed.js

cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo ✅ Setup complete!
echo.
echo 🎯 Next steps:
echo.
echo 1. Start backend (Terminal 1):
echo    cd backend ^&^& npm run dev
echo.
echo 2. Start frontend (Terminal 2):
echo    cd frontend ^&^& npm run dev
echo.
echo 3. Open browser:
echo    http://localhost:3000
echo.
echo 4. Login with:
echo    Email: judge.sharma@court.gov.in
echo    Password: Demo@123
echo.
echo 🎉 Happy coding!
pause
