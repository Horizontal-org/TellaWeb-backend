FROM node:16.14-alpine AS development

WORKDIR /usr/src/app

RUN apk add ffmpeg

COPY package*.json ./

COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

FROM node:16.14-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

COPY yarn.lock ./

RUN yarn --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
