#!/bin/sh
#

set -ex

BIN_PATH=$(cd "$(dirname "$0")"; pwd -P)
WORK_PATH=${BIN_PATH}/../

cd ${WORK_PATH}

corepack pnpm exec prisma migrate dev --name init
corepack pnpm exec prisma generate

exec corepack pnpm run start "$@"
