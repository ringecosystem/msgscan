FROM node:22-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/gripper/package.json ./packages/gripper/
RUN corepack pnpm --filter msgscan-indexer install --frozen-lockfile

WORKDIR /app/packages/gripper
COPY packages/gripper/tsconfig.json ./
COPY packages/gripper/prisma ./prisma
COPY packages/gripper/scripts ./scripts
COPY packages/gripper/src ./src
RUN corepack pnpm run build

ENTRYPOINT ["/app/packages/gripper/scripts/start.sh"]
