import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
    imports: [
        // Configuración de variables de entorno
        ConfigModule.forRoot({
            load: [EnvConfiguration], // Carga la configuración personalizada desde el archivo env.config.ts
            // Se utiliza Joi para validar las variables de entorno, asegurando que todas las variables requeridas estén presentes y sean válidas
            // hay que instalar npm joi
            validationSchema: JoiValidationSchema,
        }),

        // Sirve archivos estáticos desde la carpeta 'public'
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
        }),

        // Conexión a la base de datos MongoDB usando Mongoose
        MongooseModule.forRoot(process.env.MONGODB as string, {
            dbName: 'db_pokemon'
        }), // Se obtiene la URL desde las variables de entorno

        // Importa el módulo de Pokémon, que gestiona la lógica relacionada con los Pokémon
        PokemonModule,

        // Importa el módulo común, que contiene funcionalidades compartidas en toda la aplicación
        CommonModule,

        // Importa el módulo de semillas, utilizado para poblar la base de datos con datos iniciales
        SeedModule,
    ],
    controllers: [], // Aquí se pueden definir los controladores de la aplicación
    providers: [], // Aquí se pueden definir los servicios y proveedores de la aplicación
})
export class AppModule {}
