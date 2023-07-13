# Desplegar localmente (Por separado)

## Correr Kafka-Arch

Primero desplegar los componentes de kafka

```
docker-compose -f docker-compose-kafka.yml up --build -d
```

## Correr MongoDb

Ejecutar la imagen de mongo

```
docker run --name my-mongodb -p 27017:27017 -d mongo:latest
```

## Envs

En los proyectos, puedes duplicar .env.local.example a .env para ejecutar el
proyecto localmente

## Para api-gateway

Instalar las dependencias y luego correr en modo dev

```
cd ./api-gateway

npm install
npm run start:dev
```

Esto levatará el proyecto en el puerto 3000

## Para microservice

Instalar las dependencias y luego correr en modo dev

```
cd ./microservice

npm install
npm run start:dev
```

## Para integration-app (React)

Instalar las dependencias y luego correr en modo dev

```
cd ./integration-app

npm install
npm run dev
```

Esto levatará el proyecto en el puerto 4173
