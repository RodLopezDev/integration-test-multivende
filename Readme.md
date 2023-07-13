# Multivende - Implementation Test :rocket:

# Diagrama de Arquitectura

```mermaid
sequenceDiagram
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

<img width="1027" alt="image" src="https://github.com/RodLopezDev/integration-test-multivende/assets/83994234/a8625e7d-8f33-4a39-a64c-55d769e51a7b">

<img width="697" alt="image" src="https://github.com/RodLopezDev/integration-test-multivende/assets/83994234/be7ad249-c81a-49e2-ac0e-5ae1f0a858b2">

<img width="1424" alt="image" src="https://github.com/RodLopezDev/integration-test-multivende/assets/83994234/26ff2e37-7894-4863-95a6-e4d6b60e8f04">


<img width="1417" alt="image" src="https://github.com/RodLopezDev/integration-test-multivende/assets/83994234/9757cb29-80cc-4c81-9c8f-d040bdc6ac3b">
