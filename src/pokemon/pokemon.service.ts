import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

/**
 * Servicio para gestionar las operaciones relacionadas con los Pokémon en la base de datos.
 */
@Injectable()
export class PokemonService {
    constructor(
        /**
         * @InjectModel()
         * Inyecta el modelo Pokemon de Mongoose en el servicio para realizar operaciones en la base de datos.
         * Se debe registrar el modelo en pokemon.module.ts con:
         * MongooseModule.forFeature([{ name: Pokemon.name, schema: PokemonSchema }])
         */
        @InjectModel(Pokemon.name)
        private readonly pokemonModel: Model<Pokemon>,
    ) {}

    /**
     * Crea un nuevo Pokémon en la base de datos.
     * @param createPokemonDto - Datos del Pokémon a crear.
     * @returns El Pokémon creado.
     */
    async create(createPokemonDto: CreatePokemonDto) {
        createPokemonDto.name = createPokemonDto.name.toLowerCase();
        try {
            const pokemon = await this.pokemonModel.create(createPokemonDto);
            return pokemon;
        } catch (error) {
            this.handleExceptions(error);
        }
    }

    /**
     * Obtiene una lista paginada de todos los Pokémon.
     * @param request - Parámetros de paginación (límite y offset).
     * @returns Lista de Pokémon con paginación aplicada.
     */
    findAll(request: PaginationDto) {
        const { limit = 10, offset = 0 } = request;
        return this.pokemonModel.find()
            .limit(limit)
            .skip(offset)
            .sort({ no: 1 }) // Ordena por número de Pokémon
            .select('-__v'); // Excluye la versión del documento
    }

    /**
     * Busca un Pokémon por número, ID de MongoDB o nombre.
     * @param term - Número, ID o nombre del Pokémon.
     * @returns El Pokémon encontrado o lanza una excepción si no existe.
     */
    async findOne(term: string) {
        let pokemon;

        if (!isNaN(+term)) {
            pokemon = await this.pokemonModel.findOne({ no: term });
        }

        if (isValidObjectId(term)) {
            pokemon = await this.pokemonModel.findById(term);
        }

        if (!pokemon) {
            pokemon = await this.pokemonModel.findOne({
                name: term.toLowerCase().trim(),
            });
        }

        if (!pokemon)
            throw new NotFoundException(
                `Pokemon con name o no ${term} no se encuentra`,
            );

        return pokemon;
    }

    /**
     * Actualiza un Pokémon en la base de datos.
     * @param term - Número, ID o nombre del Pokémon a actualizar.
     * @param updatePokemonDto - Datos a actualizar.
     * @returns El Pokémon actualizado.
     */
    async update(term: string, updatePokemonDto: UpdatePokemonDto) {
        try {
            const pokemon: Pokemon = await this.findOne(term);

            if (updatePokemonDto.name)
                updatePokemonDto.name = updatePokemonDto.name
                    .toLocaleLowerCase()
                    .trim();

            const updatedPokemon = await pokemon.updateOne(updatePokemonDto, {
                new: true,
            });

            return { ...pokemon.toJSON(), ...updatePokemonDto };
        } catch (error) {
            this.handleExceptions(error);
        }
    }

    /**
     * Elimina un Pokémon de la base de datos.
     * @param id - ID del Pokémon a eliminar.
     * @returns Nada si la eliminación es exitosa, lanza una excepción si no se encuentra el Pokémon.
     */
    async remove(id: string) {
        try {
            // Método óptimo para eliminar un documento en MongoDB por su ID
            const { deletedCount } = await this.pokemonModel.deleteOne({
                _id: id,
            });

            if (deletedCount === 0)
                throw new BadRequestException(
                    `Pokemón con ID "${id}" no encontrado`,
                );

            return;
        } catch (error) {
            this.handleExceptions(error);
        }
    }

    /**
     * Maneja las excepciones generadas en las operaciones con la base de datos.
     * @param error - Error capturado.
     * @throws BadRequestException si hay un error de duplicado.
     * @throws InternalServerErrorException para otros errores desconocidos.
     */
    private handleExceptions(error: any) {
        if (error.code === 11000)
            throw new BadRequestException(
                `El Pokemón ${JSON.stringify(error.keyValue)} ya se encuentra registrado en la base de datos`,
            );

        throw new InternalServerErrorException(error.response.message);
    }
}
