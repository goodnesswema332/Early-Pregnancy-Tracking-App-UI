## Builder stage
FROM node:18-slim AS builder
WORKDIR /usr/src/app

# Install build dependencies (cache package install)
COPY package*.json ./
RUN npm ci --silent

# Copy typeconfig and source then build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

## Runtime stage
FROM node:18-slim AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=5000

# Install only production deps
COPY package*.json ./
RUN npm ci --only=production --silent

# Copy compiled output
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 5000

# Drop privileges
USER node

CMD ["node", "dist/server.js"]
