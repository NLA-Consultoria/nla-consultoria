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

# Build args para informações de git (passados pelo GitHub Actions)
ARG GIT_SHA=unknown
ARG GIT_BRANCH=unknown
ARG GIT_DATE=unknown

# Copia o bundle standalone do Next
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copia arquivos necessários para logging
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/scripts ./scripts

# Cria arquivo fake .git/HEAD para o script ler
RUN mkdir -p .git && \
    echo "ref: refs/heads/${GIT_BRANCH}" > .git/HEAD && \
    echo "${GIT_SHA}" > .git/refs_heads_${GIT_BRANCH} && \
    echo "${GIT_DATE}" > .git/commit_date

# Expõe e **força** bind correto
ENV PORT=3000
ENV HOST=0.0.0.0
EXPOSE 3000

# Default log level (pode ser sobrescrito via docker-compose)
ENV LOG_LEVEL=info

# Variáveis de ambiente com git info (fallback se script não conseguir ler)
ENV GIT_SHA=${GIT_SHA}
ENV GIT_BRANCH=${GIT_BRANCH}
ENV GIT_DATE=${GIT_DATE}

# Sobe com script customizado que chama server.js
CMD ["node", "scripts/start.js"]
