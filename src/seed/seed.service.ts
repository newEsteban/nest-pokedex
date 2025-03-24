import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
    // El constructor inyecta el modelo de Mongoose para poder interactuar con la colección de Pokémon en la base de datos.
    // Es necesario que el modelo esté registrado previamente en el módulo correspondiente (pokemon.module.ts).
    constructor(
        @InjectModel(Pokemon.name)
        private readonly pokemonModel: Model<Pokemon>,
        private readonly http: AxiosAdapter,
    ) {}

    async executeSeed() {
        // Paso 1: Elimina todos los registros existentes en la colección de Pokémon.
        await this.pokemonModel.deleteMany({});

        // Paso 2: Realiza una petición GET a la API de PokeAPI para obtener una lista de los primeros 10 Pokémon.
        const data = await this.http.get<PokeResponse>(
            `https://pokeapi.co/api/v2/pokemon?limit=650`,
        );

        // Alternativa de inserción:
        // OPCIÓN 1 (comentada): Inserta cada Pokémon individualmente usando promesas y espera a que todas se resuelvan.
        /*
        const insertPromiseArray = data.results.map(({ name, url }) => {
            const segments = url.split('/');
            const no = +segments[segments.length - 2]; // Extrae el número del Pokémon desde la URL.
            return this.pokemonModel.create({ name, no });
        });

        await Promise.all(insertPromiseArray);
        */

        // OPCIÓN 2: Mapea los datos obtenidos para extraer el nombre y número de cada Pokémon.
        // Esta opción prepara los datos para una inserción masiva o para otras operaciones.
        const pokemonToinsert: { name: string; no: number }[] = [];
        data.results.forEach(({ name, url }) => {
            const segments = url.split('/'); // Divide la URL para obtener partes relevantes.
            const no = +segments[segments.length - 2]; // Convierte el segmento correspondiente al número en un número.
            pokemonToinsert.push({ name, no });
        });

        await this.pokemonModel.insertMany(pokemonToinsert);

        // Paso final: Retorna la lista de resultados obtenida de la API.
        return 'seed execute';
    }
}
