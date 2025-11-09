# --- Step 1: Builder ---
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./

RUN npm install --ignore-scripts

COPY . .
RUN npm run build

# --- Step 2: Production ---
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./

RUN npm install --omit=dev --ignore-scripts

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
