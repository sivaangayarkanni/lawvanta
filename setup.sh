#!/bin/bash

echo "🚀 Setting up Lawvanta..."
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install shared dependencies and build
echo "📦 Installing shared dependencies..."
cd shared
npm install
npm run build
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Create data directory
mkdir -p data

# Seed database
echo "🌱 Seeding database with demo data..."
node src/scripts/seed.js

cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo ""
echo "1. Start backend (Terminal 1):"
echo "   cd backend && npm run dev"
echo ""
echo "2. Start frontend (Terminal 2):"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Open browser:"
echo "   http://localhost:3000"
echo ""
echo "4. Login with:"
echo "   Email: judge.sharma@court.gov.in"
echo "   Password: Demo@123"
echo ""
echo "🎉 Happy coding!"
