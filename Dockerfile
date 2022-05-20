FROM node:16.14 AS production

WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install -y ffmpeg python

COPY package*.json ./
COPY yarn.lock ./
RUN yarn

COPY . .
RUN yarn build

CMD ["node", "dist/main"]
