FROM node:18-bullseye-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-bullseye-slim AS runtime
ENV HOST=0.0.0.0
ENV PORT=3001
ENV NODE_ENV=production
ENV DB_PROVIDER=postgresql
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY --from=builder /app/dist/api ./api
COPY --from=builder /app/src/prisma ./prisma

EXPOSE 3001
CMD ["node", "api/main.js"]
