FROM node:20-alpine


ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /app

COPY ./package*.json ./
RUN npm ci && npm cache clean --force

RUN npm install
COPY . /app

RUN npm run build