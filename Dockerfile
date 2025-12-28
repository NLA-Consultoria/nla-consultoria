# 1) deps
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# 2) builder
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3) runner (standalone)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Instala git para obter info de versão (leve)
RUN apk add --no-cache git

# Copia o bundle standalone do Next
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copia arquivos necessários para logging
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/.git ./.git

# Expõe e **força** bind correto
ENV PORT=3000
ENV HOST=0.0.0.0
EXPOSE 3000

# Default log level (pode ser sobrescrito via docker-compose)
ENV LOG_LEVEL=info

# Sobe com script customizado que chama server.js
CMD ["node", "scripts/start.js"]
