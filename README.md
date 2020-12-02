# Delilah Resto

Trabajo práctico correspondiente al Módulo de Backend de la carrera de Desarrollo Web Full Stack de Acámica.

Proyecto de API Rest que permite administrar una lista de usuarios, productos y pedidos de un restaurante (Delilah Resto). Diseñada con conexión a una base de datos MySQL para almacenar y administrar los datos.

## Recursos utilizados
* Node.js
* Express
* Sequelize
* Mysql2
* Json Web Token
* Dotenv
* Nodemon
* Base de datos MySQL
* Postman (testing de endpoints)
* Swagger (documentación con estándar OpenAPI 3)

## Documentación

Abrir el archivo openapi.yaml y copiar su contenido en [Swagger](https://editor.swagger.io/#) o importar el mismo en el editor de código.
Permite acceder a los endpoints y métodos disponibles, junto con la información necesaria para hacer uso de los mismos.

## Instalar e inicializar el proyecto

#### 1 - Clonar proyecto
Clonar o descargar el repositorio de Github desde este [link](https://github.com/LuzSallietti/delilahresto.git)

Desde la consola, clonar el repositorio con el comando:

```bash
git clone https://github.com/LuzSallietti/delilahresto.git
```


#### 2 - Instalar dependencias
Desde la consola, con el comando:
```bash
npm install
```
#### 3 - Crear variables de entorno
Dentro de la carpeta server del repositorio, crear un archivo .env con las siguientes variables y sus valores:
* PORT = 3000
* jtw_SEED = valor

#### 4 - Crear la base de datos

* Abrir XAMPP y asegurarse que el puerto sobre el cual se está ejecutando es el 3306
* Inicializar los servicios de Apache y MySQL
* Abrir el panel de control del servicio MySQL
* Generar una nueva base de datos llamada delilah desde el panel de control, con el usuario root y sin password.
* Abrir el archivo en /database/delilahDB.sql y dentro del panel de control de la base de datos ejecutar la serie de queries del archivo o importar el mismo. Se crearán las tablas necesarias, junto con dos registros en la tabla users (uno con rol de administrador y otro con rol cliente), y otros dos registros en la tabla products.

#### 4 - Iniciar el servidor
Abrir el archivo en /server/server.js desde node
```bash
node server.js
```

## Testeo
Testear los endpoints documentados en Swagger desde Postman para poder hacer uso de la API y base de datos generadas.
