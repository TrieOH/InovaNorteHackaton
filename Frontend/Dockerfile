FROM node:22-slim AS build
WORKDIR /app
RUN corepack enable
COPY package*.json ./
RUN pnpm install --force
COPY . .
CMD ["pnpm", "run", "dev"]

EXPOSE 3000