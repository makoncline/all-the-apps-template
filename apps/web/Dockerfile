FROM node:24-bookworm-slim AS base
RUN corepack enable
WORKDIR /app

ARG NEXT_PUBLIC_SERVER_BASE_URL=http://api.example.com
ENV NEXT_PUBLIC_SERVER_BASE_URL=${NEXT_PUBLIC_SERVER_BASE_URL}

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/sdk/package.json packages/sdk/package.json
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm --filter @hello/web build

CMD ["pnpm", "--filter", "@hello/web", "start"]
