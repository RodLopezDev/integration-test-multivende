FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

COPY src ./

COPY tsconfig*.json ./

COPY public ./

RUN npm ci

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]