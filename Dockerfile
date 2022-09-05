FROM node:lts-alpine

WORKDIR /snake-reloaded-app

COPY . .

RUN npm install

EXPOSE 8090

CMD ["node", "/snake-reloaded-app/server.js"]
