# Configuración de Variables de Entorno en NestJS

Para configurar las variables de entorno en tu aplicación NestJS, sigue estos pasos:

---

## 1️⃣ Instalar `@nestjs/config`

Si aún no tienes el módulo de configuración, instálalo con:

```bash
npm install @nestjs/config
```

---

## 2️⃣ Crear un archivo `.env` en la raíz del proyecto

En la raíz de tu proyecto (`/pokedex`), crea un archivo llamado `.env` y define tus variables:

```env
MONGODB=mongodb://localhost:27017/pokedex
PORT=3000
DEFAULT_LIMIT=10
```

---

## 3️⃣ Configurar `ConfigModule` en `app.module.ts`

Abre `src/app.module.ts` y agrega `ConfigModule` para que NestJS cargue las variables de entorno:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
    imports: [
        ConfigModule.forRoot(), // Carga las variables del archivo .env
        MongooseModule.forRoot(process.env.MONGODB), // Usa la variable de entorno para MongoDB
        PokemonModule,
    ],
})
export class AppModule {}
```

---

## 4️⃣ Usar las variables en tu código con `ConfigService`

Para utilizar las variables en un servicio, es necesario importar `ConfigModule` en el módulo correspondiente e inyectar `ConfigService`.

Ejemplo en `pokemon.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
    private defaultLimit: number;

    constructor(private readonly configService: ConfigService) {
        this.defaultLimit = configService.get<number>('DEFAULT_LIMIT', 10); // Obtiene el valor de DEFAULT_LIMIT
    }
}
```

🔹 `configService.get<number>('DEFAULT_LIMIT', 10)` → Si `DEFAULT_LIMIT` no está definido, usa `10` como valor por defecto.

En el módulo correspondiente (`pokemon.module.ts`), asegúrate de importar `ConfigModule`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PokemonService } from './pokemon.service';

@Module({
    imports: [ConfigModule],
    providers: [PokemonService],
})
export class PokemonModule {}
```

---

## 5️⃣ (Opcional) Crear un archivo de configuración más estructurado

Puedes organizar mejor las variables creando un archivo `env.config.ts` en `src/config/`:

📄 `src/config/env.config.ts`

```typescript
export const EnvConfiguration = () => ({
    mongodb: process.env.MONGODB || 'mongodb://localhost:27017/pokedex',
    port: parseInt(process.env.PORT, 10) || 3000,
    defaultLimit: parseInt(process.env.DEFAULT_LIMIT, 10) || 10,
});
```

Luego, modifícalo en `app.module.ts`:

```typescript
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';

ConfigModule.forRoot({
    load: [EnvConfiguration], // Carga la configuración personalizada
}),
```

---

## 6️⃣ Reiniciar el servidor para aplicar cambios

Cada vez que modifiques el archivo `.env`, reinicia tu servidor para que los cambios se reflejen:

```bash
npm run start:dev
```

---

## 📌 Resumen

1. 📦 Instala `@nestjs/config`.
2. 📝 Crea un archivo `.env` con las variables.
3. 🔧 Configura `ConfigModule` en `app.module.ts`.
4. 🛠️ Usa `ConfigService` para acceder a las variables en los servicios.
5. 📁 (Opcional) Usa un archivo `env.config.ts` para organizar mejor la configuración.
6. 🔄 Reinicia el servidor para aplicar los cambios.

Con esto, tu aplicación NestJS manejará las variables de entorno correctamente. 🚀

