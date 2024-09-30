FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install glob rimraf

RUN npm install

COPY apps/mail apps/mail
COPY libs libs

RUN cd apps/mail && npm install

RUN npm run build mail

FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY apps/mail/.env ./apps/mail/

RUN npm install --only=production

COPY --from=development /usr/src/app/apps/mail/node_modules/ ./node_modules/
COPY --from=development /usr/src/app/dist ./dist


CMD ["node", "dist/apps/mail/main"]