FROM node:16.14-alpine AS development

WORKDIR /usr/src/app

RUN apk add ffmpeg

COPY package*.json ./

COPY package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:16.14-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

RUN apk add ffmpeg

COPY package*.json ./

COPY package-lock.json ./

RUN npm install

RUN npm install -g ts-node

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
