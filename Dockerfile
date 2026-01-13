FROM node:22-alpine AS builder

WORKDIR /app

# Install build tooling (needed for native modules and TypeScript builds)
RUN apk add --no-cache python3 make g++ libc6-compat

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

# Copy runtime artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server-dist ./server-dist

EXPOSE 4001
CMD ["node", "server-dist/index.js"]