## Sistema de ventas a crédito La Vendimia

Éste sistema está escrito en NodeJS versión >= 7.10.

Es una plataforma en tiempo real, que hace uso de tecnología de websockets Socket.io para llevar a cabo todo el CRUD de la operación

La arquitectura de la aplicación es propia. Bajo licencia pública.

La arquitectura base permite hacer multiples conexiones a diferentes engines de base de datos, tales como MSSQL, MySQL, MariaDB, PostgreSQL, MongoDB y DynamoDB

Los controladores aceptados están en el directorio service/src/api



## Unit Tests

Éste proyecto cuenta con pruebas unitarias para cada caso de arquitectura.

**pre-requisitos**
* Instalar NodeJS Version v6.10.3 or higher.
* Instalar MongoDB / o tener acceso a una instancia MongoDB

### Como instalar
#### Windows

[Instalar NodeJS en Windows](https://nodejs.org/en/)

[Instalar MongoDB en Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)

#### OsX

[Instalar NodeJS en OsX](http://blog.teamtreehouse.com/install-node-js-npm-mac)

[Instalar MongoDB en OsX](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)

#### Linux (Probado en Ubuntu 16.04 LTS)

[Instalar NodeJS en Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04)

[Instalar MongoDB en Ubuntu](https://docs.mongodb.com/v3.2/tutorial/install-mongodb-on-ubuntu/)

#### Finalmente
once we got NodeJS and MongoDB running, we set our project.

## Configuración del proyecto
**Primero debemos configurar nuestro proyecto**


Para ejecutar la aplicación primero se debe cambiar la configuración básica / local / development y producción,
la configuración local, hace un override a la configuración development.

```javascript

module.exports = {
    host: {
        port: 8081,
        crossOrigin: true
    },
    db: {
        //aqui pueden ir diferentes engines según las conexiones.
        mongodb: {
            engine: 'mongodb',
            host: 'localhost',
            port: 27017,
            database: 'test'
        }
    },
    apps:[
        {
            name: "App Web",
            _id: '5938944d84c88f1be8064841'
        },{
            name: "App Android",
            _id: '5938944d84c88f1be8064842'
        },{
            name: "App iOs",
            _id: '5938944d84c88f1be8064843'
        }
    ],
    security:{
        sessionExpiresMinutes: 30
    }
};
```


##### Instalar y Generar dependencias

Una vez configurado, para instalar dependencias debemos ejecutar:

```
cd project-directory/
npm install
```

una vez instaladas las dependencias, debemos ejecutar el generador básico.


```
cd project-directory/
cd data/generator
npm run generate-all-development

```

### Ejecutar Servicios

Una vez instaladas las dependencias, para ejecutar los servicios debemos ejecutar
```
cd project-directory/
npm run start --debug
```