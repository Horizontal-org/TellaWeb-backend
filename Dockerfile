FROM node:22.23.3-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

RUN apk add ffmpeg

COPY package*.json ./

RUN npm ci

RUN npm install -g ts-node

COPY . .

RUN npm run build

CMD ["node", "dist/src/main"]
