
# 🚀 Implementación de Joi en NestJS para Validación de Variables de Entorno  

## 📌 Introducción  
Joi es una poderosa biblioteca de validación que permite asegurar que las variables de entorno tengan valores correctos antes de que la aplicación se inicie. En esta guía, aprenderás a integrar Joi en una aplicación NestJS para validar variables de entorno.  


## **1️⃣ Instalación de Dependencias**  
Para comenzar, instala **Joi** y el módulo de configuración de NestJS:  

```sh
npm install @nestjs/config joi

Si usas Yarn, ejecuta:

yarn add @nestjs/config joi



⸻

2️⃣ Configurar el archivo .env

Crea un archivo .env en la raíz del proyecto con las variables de entorno:

MONGODB=mongodb://localhost:27017/pokedex
PORT=3005
DEFAULT_LIMIT=10



⸻

3️⃣ Crear el Esquema de Validación con Joi

En la carpeta src/config/, crea un archivo joi.validation.ts y define la validación:

📄 src/config/joi.validation.ts

import * as Joi from 'joi';

/**
 * Esquema de validación de variables de entorno usando Joi.
 * Asegura que las variables requeridas estén presentes y tengan valores válidos.
 */
export const JoiValidationSchema = Joi.object({
    MONGODB: Joi.string().uri().required(), // Debe ser una URI válida y es obligatorio
    PORT: Joi.number().default(3005), // Debe ser un número y tiene un valor por defecto
    DEFAULT_LIMIT: Joi.number().default(10), // Debe ser un número y tiene un valor por defecto
});



⸻

4️⃣ Integrar Joi con ConfigModule en app.module.ts

En src/app.module.ts, configura ConfigModule para validar las variables de entorno con Joi:

📄 src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // ojo No requerido => Hace que las variables de entorno estén disponibles globalmente
            validationSchema: JoiValidationSchema, // Usa Joi para validar las variables de entorno
        }),
    ],
})
export class AppModule {}



⸻

5️⃣ Acceder a las Variables de Entorno con ConfigService

Para acceder a las variables validadas, usa ConfigService en cualquier servicio.

📄 Ejemplo en src/pokemon/pokemon.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
    private defaultLimit: number;

    constructor(private readonly configService: ConfigService) {
        this.defaultLimit = this.configService.get<number>('DEFAULT_LIMIT', 10); // Obtiene el valor validado
    }
}



⸻

6️⃣ Probar la Configuración

Ejecuta la aplicación para verificar que las variables de entorno se validen correctamente:

npm run start:dev

Si falta alguna variable obligatoria, como MONGODB, NestJS mostrará un error de validación y la aplicación no se iniciará.

⸻

🚀 Beneficios de Usar Joi en NestJS

✅ Evita errores por valores incorrectos en las variables de entorno.
✅ Garantiza que las configuraciones esenciales estén definidas antes de ejecutar la aplicación.
✅ Fácil integración con ConfigModule.
✅ Permite establecer valores por defecto para mayor flexibilidad.

⸻

📌 Resumen

1️⃣ Instalar Joi y @nestjs/config con npm install @nestjs/config joi.
2️⃣ Crear el archivo .env con las variables necesarias.
3️⃣ Definir el esquema de validación en joi.validation.ts.
4️⃣ Configurar ConfigModule en app.module.ts para aplicar la validación.
5️⃣ Usar ConfigService en cualquier servicio para acceder a las variables.
6️⃣ Ejecutar la aplicación y verificar la validación.

Con esta implementación, tu aplicación NestJS validará automáticamente las variables de entorno con Joi, asegurando que sean correctas antes de iniciar. 🚀


📚 Referencias
	•	NestJS - ConfigModule
	•	Joi - Validación de Datos

```

## Esto puede trabajar conjuto al config_env, ya que nos da el mapeo de los datos y hace conversiones