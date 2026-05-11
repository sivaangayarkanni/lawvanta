FROM node:18-alpine

WORKDIR /app

# Copy shared package files
COPY shared/package*.json ./shared/
COPY shared/tsconfig.json ./shared/

# Copy backend package files
COPY backend/package*.json ./backend/

# Install shared dependencies and build
WORKDIR /app/shared
COPY shared/src ./src
RUN npm install
RUN npm run build

# Install backend dependencies
WORKDIR /app/backend
COPY backend/src ./src
COPY backend/tsconfig.json ./
RUN npm install

# Build backend TypeScript
RUN npm run build

# Create data directory for SQLite
RUN mkdir -p ./data

EXPOSE 5000

CMD ["node", "dist/index.js"]
