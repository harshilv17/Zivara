# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Install 'serve' to host static files
RUN npm install -g serve

COPY --from=builder /app/out ./out

# Change ownership
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["serve", "-s", "out", "-p", "3000"]
