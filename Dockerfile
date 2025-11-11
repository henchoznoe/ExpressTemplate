#
# Copyright (c) 2025 Noé Henchoz
# Author: Noé Henchoz
# File: Dockerfile
# Title: Application Dockerfile
# Description: Multi-stage Dockerfile for building and running the Node.js application.
# Last modified: 2025-11-11
#

# --- Constants ---
ARG PORT=3000

# --- Stage 1: Builder ---
# This stage builds the TypeScript source code into JavaScript.
# It uses a full Node.js environment with all devDependencies.
FROM node:22-alpine AS builder

# Set the working directory inside the container.
WORKDIR /app

# Copy package files first to leverage Docker caching.
COPY package*.json ./

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

# Set environment variables for production.
ENV NODE_ENV=production
ENV PORT=${PORT}

# Expose the port defined by the variable.
EXPOSE ${PORT}

# Define the command to run the application.
# This uses the 'start' script from package.json.
CMD ["npm", "start"]
