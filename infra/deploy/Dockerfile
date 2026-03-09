FROM node:24-bookworm-slim
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY infra/deploy ./infra/deploy

CMD ["pnpm", "exec", "tsx", "infra/deploy/deploy-hook.ts"]
