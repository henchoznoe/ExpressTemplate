# @file Dockerfile
# @title Application Dockerfile
# @description Multi-stage Dockerfile for building and running the Node.js application.
# @author Noé Henchoz
# @date 2025-12-02
# @license MIT
# @copyright (c) 2025 Noé Henchoz

# --- Constants ---
ARG PORT=3000

# --- Stage 1: Builder ---
# This stage builds the TypeScript source code into JavaScript.
# It uses a full Node.js environment with all devDependencies.
FROM node:22-alpine AS builder

# Set the working directory inside the container.
WORKDIR /app

# Copy package files and Prisma schema first to leverage Docker caching.
COPY package*.json ./
COPY prisma/schema.prisma ./prisma/

# Install ALL dependencies (including devDependencies) needed for the build.
RUN npm ci --ignore-scripts

# Generate Prisma Client BEFORE copying source code
# This prevents re-generating client if only source code changes
RUN npx prisma generate

# Copy all files for the build
COPY . .
# Run the build script
RUN npm run build

# --- Stage 2: Production ---
# This stage creates the final, lean image for production.
# It will only contain the built code and production dependencies.
FROM node:22-alpine

# Set the working directory.
WORKDIR /app

# Create logs directory and set ownership permissions immediately
RUN chown -R node:node /app

# Switch to non-root user for all subsequent operations
USER node

# Copy package files with correct ownership
COPY --chown=node:node package*.json ./

# Install ONLY production dependencies as 'node' user
RUN npm ci --omit=dev --ignore-scripts

# Copy built artifacts from builder
COPY --from=builder --chown=node:node /app/dist ./dist

# Copy the GENERATED Prisma Client from builder
COPY --from=builder --chown=node:node /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=node:node /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copy Prisma schema (useful for metadata/debugging, though strict runtime usage relies on the generated client)
COPY --from=builder --chown=node:node /app/prisma ./prisma

# Set environment variables for production.
ENV NODE_ENV=production
ENV PORT=${PORT}

# Expose the port defined by the variable.
# Ports > 1024 can be exposed by non-root users.
EXPOSE ${PORT}

# Define the command to run the application.
# This will now be executed as the 'node' user.
CMD ["node", "dist/index.js"]
