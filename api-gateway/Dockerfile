FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

COPY src ./

COPY nest-cli.json ./

COPY tsconfig.build.json ./

COPY tsconfig.json ./

RUN npm ci

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]