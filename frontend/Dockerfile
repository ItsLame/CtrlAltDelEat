FROM node:20-alpine

WORKDIR /app/frontend

COPY ./package*.json ./

RUN npm install
COPY . /app/frontend
RUN npm run build