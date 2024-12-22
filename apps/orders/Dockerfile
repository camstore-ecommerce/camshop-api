FROM node:20-alpine AS development

# Install OpenSSL
RUN apk add --no-cache openssl

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json
COPY apps/orders/prisma ./prisma

RUN npm install glob rimraf

RUN npm install

COPY apps/orders apps/orders
COPY proto proto
COPY libs libs

RUN cd apps/orders && npm install --only=production

RUN npm run build orders

FROM node:20-alpine AS production

# Install OpenSSL
RUN apk add --no-cache openssl

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY apps/orders/prisma ./prisma
COPY apps/orders/.env ./apps/orders/
COPY apps/orders/.env .

RUN npm install --only=production

COPY --from=development /usr/src/app/apps/orders/node_modules/ ./node_modules/
COPY --from=development /usr/src/app/dist ./dist

RUN mv dist/proto proto

CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && node dist/apps/orders/src/main"]