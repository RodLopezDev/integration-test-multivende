# Multivende - Implementation Test :rocket:

- [Descripción](#Descripción)
- [Instalación](#Instalación)
- [Diagrama de Instación de App](#Diagrama_de_Instalación_de_App)
- [Diagrama de Arquitectura](#Diagrama_de_Arquitectura)

# Descripción

La solución permite conectarnos a los servicos API de multivende mediante un app
que debe ser instalada en la cuenta del usuario.
La solución incluye.

- MongoDb: Base de datos.
- NestJS (Backend): Funciona como backend y apiGateway entre internet y los microservicios
- NestJS (Microservice): Microservicio que implementa una conexión Kafka para la comunicación
- ReactApp (Frontend): Web App para la interación con el backend.
- confluentinc/cp-kafka: Kafka server.
- provectuslabs/kafka-ui: Web app para administración y GUI de kafka.

# Instalación

- [Instalación en local](./docs/local-deploy.md)!
- [Despliegue con Docker](./docs/docker.md)!
- [Capturas](./docs/software-description.md)!

# Diagrama de Instalación de App

Instalación de la app en la plataforma de multivende:

- Primero se ingresa las credenciales del app.
- Se debe autorizar el app mediante la plataforma multivende.
- Esto genera un code que luego se ocupará para generar un token de autenticación.

```mermaid
sequenceDiagram
autonumber
    actor user
    participant frontApp

    Note over user,apiGateway: Instalación app

    user->>frontApp: Ingresa credenciales
    frontApp-->>apiGateway: Redirige a /start
    apiGateway-->>multivendeApp: Redirige a /apps
    user-->>multivendeApp: Autoriza instalación
    multivendeApp-->>apiGateway: Retorna 'code'
    apiGateway-->>mongodb: Persiste datos
    apiGateway-->>frontApp: Informa exito

    Note over user,mongodb: Auth app
    user->>frontApp: Solicita auth
    frontApp-->>apiGateway: Request a /auth
    apiGateway-->>multivendeApp: Request a /oauth/token
    apiGateway-->>mongodb: Persiste datos
    apiGateway-->>frontApp: Informa exito
```

# Diagrama de Arquitectura

El software incluye una implementación de un apiGateway (backend) que se comunica con el microservicio mediante TRANSPORT.KAFKA.

```mermaid
sequenceDiagram
    autonumber
    participant integrationApp
    participant apiGateway
    participant kafka
    participant microservice
    participant mongodb

    Note over integrationApp,mongodb: Request/Reply Process

    integrationApp-->>apiGateway: HTTP Request

    Note right of apiGateway: It store all process on mongodb document
        apiGateway-->>mongodb: Get Stored info

    alt Message Pattern Imp.
        alt Topic [BULK_NODE]
            apiGateway->>+kafka: Produce
            kafka->>-microservice: Consume
        end

        alt Topic [BULK_NODE.reply]
            microservice->>+kafka: Produce
            kafka->>-apiGateway: Consume
        end
    end

    kafka->>microservice: TRIGGER PROCESS

    loop Bulk Update
        alt EventSourcing Pattern Imp.
            microservice->>mongodb: Get/Store info
            microservice->>kafka: PROCESS
        end
    end

    Note over kafka,mongodb: Event/Sourcing Process
```
