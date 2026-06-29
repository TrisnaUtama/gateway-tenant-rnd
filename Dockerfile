# Dockerfile — asumsi runtime Bun (sesuai log "bun dev" kamu)
FROM oven/bun:1-alpine
WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile --production

COPY . .

ENV NODE_ENV=production
EXPOSE 4000

CMD ["bun", "src/server.ts"]