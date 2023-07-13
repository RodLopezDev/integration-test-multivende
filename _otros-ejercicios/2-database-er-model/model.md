# Modelado de datos

## Modelo Entidad Relación

- En naranja aquellas tablas que representan entidades de negocio, son independientes y se pueden modificar en procesos
  externos al de la compra
- La tabla compra hace de cabecera en el proceso de comprar y almacena los totales de la transacción.
- La tabla Detalle permite una relación muchos-a-muchos entre las compras y los productos, esto permite que los clientes
  compren cualquier producto y cualquier producto sea comprado por cualquier persona.
- Finalmente la tabla Detalle-despacho permite asignar a grupos de productos asociados en la compra con un despacho registrado
  previamente o que se acaba de registrar.

<img width="872" alt="image" src="https://github.com/RodLopezDev/integration-test-multivende/assets/83994234/a24aea80-04db-43cc-b28c-9dcbf1b2cb95">

## Ejemplo en postgresql

```sql
CREATE TABLE IF NOT EXISTS public.cliente (
    id SERIAL PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    dni VARCHAR(10) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    correo VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.producto (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    precio float(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.despacho (
    id SERIAL PRIMARY KEY,
    direccion VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.compra (
    id SERIAL PRIMARY KEY,
    clientId INT REFERENCES public.client(id),
    total FLOAT(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.detalle (
    id SERIAL PRIMARY KEY,
    compraId INT REFERENCES public.compra(id),
    productoId INT REFERENCES public.producto(id),
    total FLOAT(20) NOT NULL,
    cantidad INT NOT NULL,
    descuento FLOAT(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.detalle_despacho (
    id SERIAL PRIMARY KEY,
    despachoId INT REFERENCES public.detalle(id),
    despachoId INT REFERENCES public.despacho(id),
    precio FLOAT(20) NOT NULL,
    fecha TIMESTAMP NOT NULL
);
```
