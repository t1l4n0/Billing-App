# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies including curl and libssl3 for Prisma compatibility
RUN apk add --no-cache openssl curl libssl3

# Set Prisma binary target for Alpine Linux compatibility
ENV PRISMA_CLI_BINARY_TARGETS="linux-musl"

# Copy package files first for better caching
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
# This ensures platform-specific binaries are installed correctly
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application (now with all dependencies available)
RUN npm run build

# Remove devDependencies after build to reduce image size
RUN npm prune --production

# Expose port
EXPOSE 8080

# Set environment variable for port
ENV PORT=8080

# Start the application
CMD ["sh", "-c", "npx prisma db push && npm start"]