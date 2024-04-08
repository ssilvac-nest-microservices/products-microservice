# Product Microservice

## Dev

1. Clonar repositorio
2. Instalar dependencias
3. Crear un archivo `.env` basado en el archivo `env.template`
4. Ejecutar migracion de prisma `npx prisma migrate dev`
5. levantar servidor nats
```
docker run -d --name nats-main -p 4222:4222 -p 8222:8222 nats
```
6. Ejecutar `pnpm start:dev`