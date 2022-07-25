FROM node:16.14-bullseye AS base
RUN apt-get update
RUN apt-get install -y ffmpeg python libvips
RUN apt-get clean

FROM base AS build
COPY --chown=node:node package.json package-lock.json ./
RUN npm install
COPY --chown=node:node . .
RUN npm run build

FROM node:16.14-bullseye-slim
WORKDIR /usr/src/app
RUN apt-get update
RUN apt-get install -y ffmpeg
RUN apt-get clean
RUN npm install -g ts-node

COPY --chown=node:node --from=build package.json package-lock.json ./
COPY --chown=node:node --from=build node_modules node_modules
COPY --chown=node:node --from=build dist ./dist
RUN npm prune --production

CMD ["node", "dist/main"]