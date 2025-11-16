#
# Copyright (c) 2025 Noé Henchoz
# Author: Noé Henchoz
# File: Dockerfile
# Title: Application Dockerfile
# Description: Multi-stage Dockerfile for building and running the Node.js application.
# Last modified: 2025-11-15
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
COPY prisma/schema.prisma ./

# Install ALL dependencies (including devDependencies) needed for the build.
RUN npm install --ignore-scripts

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

# Copy package files (for installing production deps).
COPY package*.json ./

# Install ONLY production dependencies.
RUN npm install --omit=dev --ignore-scripts

# Copy the built code from the 'builder' stage.
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Create the logs directory so that the 'node' user owns it.
# This ensures Winston has write permissions, even with volume mounts.
RUN mkdir -p logs

# Change ownership of all application files to the non-root 'node' user.
# This user is included by default in the 'node:alpine' base image.
RUN chown -R node:node /app

# Set environment variables for production.
ENV NODE_ENV=production
ENV PORT=${PORT}

# Switch to the non-root 'node' user for security.
USER node

# Expose the port defined by the variable.
# Ports > 1024 can be exposed by non-root users.
EXPOSE ${PORT}

# Define the command to run the application.
# This will now be executed as the 'node' user.
CMD ["npm", "start"]
