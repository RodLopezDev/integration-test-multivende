# Run

docker run --name my-mongodb -p 27017:27017 -d mongo:latest

docker build -t multivende-front-app . 

docker run --name container-x -p 4000:4000 --env-file .env -d multivende-front-app

# run bash
docker exec -it 2b3b31ff4b7391f6880ce53f3ffcbc2d7c230b3a1f67da7979928825515662df /bin/sh