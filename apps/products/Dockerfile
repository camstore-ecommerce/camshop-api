FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install glob rimraf

RUN npm install

COPY apps/products apps/products
COPY proto proto
COPY libs libs

RUN npm run build products

FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY apps/products/.env ./apps/products/

RUN npm install --only=production

COPY --from=development /usr/src/app/dist ./dist
RUN mv dist/proto proto

CMD ["node", "dist/apps/products/src/main"]