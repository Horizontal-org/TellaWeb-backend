FROM node:20.14.0-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

RUN apk add ffmpeg

COPY package*.json ./

COPY package-lock.json ./

RUN npm install

RUN npm install -g ts-node

COPY . .

RUN npm run build

CMD ["node", "dist/main"]
