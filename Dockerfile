# Multi-stage build for production
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for canvas and native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev

# Copy package files
COPY package*.json ./
COPY package-lock.json* ./

# Install dependencies (use install to avoid lockfile mismatch failures in CI)
RUN npm install --no-audit --no-fund

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install runtime dependencies for canvas
RUN apk add --no-cache \
    cairo \
    jpeg \
    pango \
    giflib \
    pixman

# Copy package files
COPY package*.json ./
COPY package-lock.json* ./

# Install production dependencies only (omit dev deps)
RUN npm install --omit=dev --no-audit --no-fund

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5000

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

# Start the application
CMD ["npm", "start"]
