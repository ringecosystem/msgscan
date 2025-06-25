#!/bin/sh
#

set -ex

BIN_PATH=$(cd "$(dirname "$0")"; pwd -P)
WORK_PATH=${BIN_PATH}/../

ENV_FILE=${BIN_PATH}/env-gripper.local.sh

if [ -f ${ENV_FILE} ]; then
  . ${ENV_FILE} || true
fi


LAUNCHER_PATH=${WORK_PATH}/packages/gripper

cd ${LAUNCHER_PATH}

npm run build
npm run start -- $@
