# --- Stage 1: Build the Frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /usr/src/app

# Copy package files to preserve relative workspace structure
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install frontend dependencies
RUN cd frontend && npm ci

# Copy frontend source code and backend folder structure (so Vite can build to ../backend/public/app/dist)
COPY frontend/ ./frontend/
COPY backend/ ./backend/

# Build frontend production assets
RUN cd frontend && npm run build

# --- Stage 2: Package and Run the Backend ---
FROM node:20-alpine
WORKDIR /usr/src/app

# Install backend production dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Copy backend source code
COPY backend/ ./backend/

# Copy the built frontend from Stage 1 builder
COPY --from=frontend-builder /usr/src/app/backend/public/app/dist ./backend/public/app/dist

# Expose port and run the server
EXPOSE 5000
WORKDIR /usr/src/app/backend
CMD ["npm", "start"]
