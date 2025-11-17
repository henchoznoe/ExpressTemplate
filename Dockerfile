#
# Copyright (c) 2025 Noé Henchoz
# Author: Noé Henchoz
# File: Dockerfile
# Title: Application Dockerfile
# Description: Multi-stage Dockerfile for building and running the Node.js application.
# Last modified: 2025-11-17
#

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
RUN npm install --ignore-scripts

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
# We do this on the empty directory to be fast.
RUN mkdir -p logs && chown -R node:node /app

# Switch to non-root user for all subsequent operations
USER node

# Copy package files with correct ownership
COPY --chown=node:node package*.json ./

# Install ONLY production dependencies as 'node' user
RUN npm install --omit=dev --ignore-scripts

# Copy built artifacts and Prisma schema from builder with correct ownership
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Set environment variables for production.
ENV NODE_ENV=production
ENV PORT=${PORT}

# Expose the port defined by the variable.
# Ports > 1024 can be exposed by non-root users.
EXPOSE ${PORT}

# Define the command to run the application.
# This will now be executed as the 'node' user.
CMD ["node", "dist/index.js"]
