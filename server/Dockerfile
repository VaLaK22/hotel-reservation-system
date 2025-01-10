
FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .
RUN apk add --no-cache netcat-openbsd


EXPOSE 3000


# wait for postgres to be ready
CMD /bin/sh -c "until nc -z postgres 5432; do echo 'Waiting for PostgreSQL...'; sleep 1; done; npm run migrate && npm run dev"
