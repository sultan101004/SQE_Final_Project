FROM node:18-bullseye-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund
# Install esbuild matching Vite 2.x deps to avoid WSL/proc issues
RUN npm install -g esbuild@0.12.12
ENV ESBUILD_BINARY_PATH=/usr/local/bin/esbuild

COPY . .
RUN npm run build

FROM node:18-bullseye-slim AS runtime
WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm install -g serve

COPY --from=builder /app/dist ./dist

ENV PORT=5173
EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]

