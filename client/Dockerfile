FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm i @angular/cli

COPY . .

RUN npm run build --prod

FROM nginx:alpine

COPY --from=build /app/dist/client/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


