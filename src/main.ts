import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    // Crea una instancia de la aplicación NestJS basada en el módulo principal AppModule
    const app = await NestFactory.create(AppModule);

    // Establece un prefijo global para todas las rutas de la API
    app.setGlobalPrefix('api/v2');

    // Configura los pipes de validación a nivel global para la aplicación
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Elimina automáticamente propiedades no definidas en los DTOs
            forbidNonWhitelisted: true, // Genera un error si se reciben propiedades no permitidas
            transform: true, // Convierte automáticamente los tipos de datos según los DTOs
            transformOptions: {
                enableImplicitConversion: true, // Permite conversiones implícitas de tipos
            }
        }),
    );

    // Inicia el servidor y lo escucha en el puerto definido en las variables de entorno o en el 3000 por defecto
    await app.listen(process.env.PORT ?? 3000);
}

// Llama a la función bootstrap para iniciar la aplicación
bootstrap();
