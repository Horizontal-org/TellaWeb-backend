FROM node:12.19.0-alpine3.9 AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn

COPY . .
RUN yarn build

FROM node:12.19.0-alpine3.9 as production

EXPOSE 3000
ENV PORT 3000
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn --only=production

COPY . .
COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/main"]
