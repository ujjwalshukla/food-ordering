FROM node:8

WORKDIR /usr/app

COPY package*.json ./
RUN npm install -qy

COPY . .

WORKDIR /usr/app
RUN npm install --only=dev
RUN rm db.development.sqlite

RUN node ./node_modules/sequelize-auto-migrations/bin/runmigration
RUN node_modules/.bin/sequelize db:seed:all --debug
EXPOSE 8080

CMD ["npm", "start"]