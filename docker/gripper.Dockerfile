FROM node:22-alpine

WORKDIR /app

COPY packages/gripper .

RUN yarn install \
  && yarn build \
  && yarn cache clean

ENTRYPOINT ["/app/scripts/start.sh"]
