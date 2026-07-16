# Build dist folder in frontend


FROM node:20-alpine as frontend-folder

COPY ./frontend /app

WORKDIR /app

RUN npm install

RUN npm run build

# copy everthing inside dist folder to backend

FROM node:20-alpine

COPY ./backend /app

WORKDIR /app

RUN npm install

COPY --from=frontend-folder /app/dist /app/public

CMD ["node","server.js"]

