FROM node:16-alpine

COPY package*.json ./

COPY tsconfig*.json ./

COPY src ./src

RUN npm install

RUN npm run build

CMD ["npm", "start"]

#docker build -t example-multivende .
#docker run -p 3000:3000 -d --env-file .env example-multivende
#docker run -it --rm example-multivende   