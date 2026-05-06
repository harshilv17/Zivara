# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Install OpenSSL for Prisma runtime
RUN apk add --no-cache openssl

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Copy SQLite database
COPY --from=builder /app/prisma/dev.db ./prisma/dev.db

# Set environment variables
ENV DATABASE_URL="file:./prisma/dev.db"
ENV PORT=4000
ENV JWT_SECRET="supersecret_zivara_key_123"
ENV NODE_ENV=production

# Change ownership
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 4000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:4000/ || exit 1

CMD ["node", "dist/index.js"]
