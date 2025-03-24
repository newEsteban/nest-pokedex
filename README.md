<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Ejecutar en desarrollo
1. Clonar el repositorio
2. Ejecutar
```
npm install
```
3. Tener Nesc CLI instalado
```
npm i -g @nestjs/cli
```

4. Levantar la base de datos
```
docker compose up -d
```

5. Reconstruir la base de datos
Solo se ejecuta en desarrollo
```
localhost:3000/api/v2/seed
```

## Stack usado
* MongoDB
* Nest

## Atajos
https://docs.nestjs.com/techniques/mongodb
1. instalar la conexion de nest a mongo
```
npm i @nestjs/mongoose mongoose

```


