FROM node:16-alpine AS development

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npm run build

FROM node:16-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/node_modules/ ./node_modules
COPY --from=development /usr/src/app/package*.json ./

RUN npm run build
CMD ["npm", "run", "start:migrations:prod"]