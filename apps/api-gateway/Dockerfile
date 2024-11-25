FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install glob rimraf

RUN npm install

COPY apps/api-gateway apps/api-gateway
COPY proto proto
COPY libs libs

RUN npm run build api-gateway

FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY apps/api-gateway/.env ./apps/api-gateway/

RUN npm install --only=production

COPY --from=development /usr/src/app/dist ./dist
RUN mv dist/proto proto

CMD ["node", "dist/apps/api-gateway/src/main"]

