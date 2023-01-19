FROM node:16-alpine

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY . ./

RUN npm install

EXPOSE 3000

CMD [ "node", "app.js" ]
