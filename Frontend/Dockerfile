FROM node:22-slim AS build
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

COPY . .

RUN pnpm build

FROM node:22-slim AS production
WORKDIR /app
RUN corepack enable

COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["pnpm", "start"]
