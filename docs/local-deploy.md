# Run

docker run --name my-mongodb -p 27017:27017 -d mongo:latest

docker build -t multivende-front-app . 

docker run --name container-x -p 4000:4000 -d multivende-front-app