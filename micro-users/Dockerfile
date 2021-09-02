FROM node:14.15.4-alpine

RUN mkdir -p /app

WORKDIR /app

COPY package*.json ./

RUN cat package.json
RUN ls /app
RUN npm i

ADD . .

RUN npm run build

EXPOSE 3002

CMD ["npm", "run", "start:prod"]