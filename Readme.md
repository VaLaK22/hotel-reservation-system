# Hotel Reservation System

A full-stack Hotel Reservation System built with Angular for the frontend and Node.js/Express with TypeScript for the backend. It utilizes PostgreSQL for the database and Knex for query building and migrations. The application allows managing rooms, reservations, and guests, with features like pagination, form validations, and comprehensive logging.

## Installation

### Backend

1. Install dependencies

```bash
cd server && npm install
```

2. Create a `.env` file in the root of the `server` directory and cpoy the contents of the `.env.example` file into it. Replace the values with your own.
3. Run the migrations

```bash
npm run migrate
```

4. Start the server

```bash
npm run dev
```

### Frontend

1. Install dependencies

```bash
cd client && npm install
```

2. Start the server

```bash
ng serve
```

### Docker

1. Build the images

```bash
docker-compose --env-file ./server/.env build
```

2. Start the containers

```bash
docker-compose --env-file ./server/.env up
```

## Docker

- After you have started the containers, you can access the frontend at `http://localhost`, the swagger documentation at `http://localhost:3000/api-docs`, and the backend at `http://localhost:3000`.
