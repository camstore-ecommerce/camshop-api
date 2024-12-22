FROM node:20-alpine AS development

RUN apk add --no-cache openssl

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json
COPY apps/users/prisma ./prisma

RUN npm install glob rimraf

RUN npm install

COPY apps/users apps/users
COPY proto proto
COPY libs libs

RUN cd apps/users && npm install --only=production && npx tsc ./prisma/seed.ts

RUN npm run build users

FROM node:20-alpine AS production

RUN apk add --no-cache openssl

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json .
COPY apps/users/prisma ./prisma
COPY apps/users/.env ./apps/users/
COPY apps/users/.env .

RUN npm install --only=production

COPY --from=development /usr/src/app/apps/users/prisma/seed.js ./prisma/
COPY --from=development /usr/src/app/apps/users/node_modules/ ./node_modules/
COPY --from=development /usr/src/app/dist ./dist

RUN mv dist/proto proto

CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && node prisma/seed && node dist/apps/users/src/main"]