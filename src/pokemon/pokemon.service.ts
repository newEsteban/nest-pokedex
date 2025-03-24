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
 * @Injectable()
 * Hace que PokemonService pueda ser inyectado en otros servicios o controladores.
 */
@Injectable()
export class PokemonService {
    constructor(
        /**
         * @InjectModel()
         * Inyecta el modelo Pokemon de Mongoose en el servicio para realizar operaciones en la base de datos.
         * Recuerda que primer se debe Registra el modelo Pokemon para que NestJS pueda inyectarlo en el servicio. en pokemon.module.ts
         * MongooseModule.forFeature([{ name: Pokemon.name, schema: PokemonSchema }])
         */
        @InjectModel(Pokemon.name)
        private readonly pokemonModel: Model<Pokemon>,
    ) {}

    async create(createPokemonDto: CreatePokemonDto) {
        createPokemonDto.name = createPokemonDto.name.toLowerCase();
        try {
            const pokemon = await this.pokemonModel.create(createPokemonDto);
            return pokemon;
        } catch (error) {
            this.handleExceptions(error);
        }
    }

    findAll( request: PaginationDto ) {
        const { limit = 10, offset = 0 } = request;
        return this.pokemonModel.find()
            .limit(limit)
            .skip(offset)
            .sort({
                no: 1
            })
            .select('-__v');
    }

    async findOne(term: string) {
        let pokemon;

        if (!isNaN(+term)) {
            pokemon = await this.pokemonModel.findOne({ no: term });
        }

        if (isValidObjectId(term)) {
            pokemon = this.pokemonModel.findById(term);
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

    async remove(id: string) {
        try {
            // De este modo se hacen dos consultas, pero hay un mejor modo
            // const pokemon = await this.findOne(id);
            // await pokemon.deleteOne();
            // Es es la manera mas optima de eliminar por un  mongo ID
            const { deletedCount } = await this.pokemonModel.deleteOne({
                _id: id,
            });
            if (deletedCount === 0)
                throw new BadRequestException(
                    `Pokemón with id "${id}" not found`,
                );

            return;
        } catch (error) {
            this.handleExceptions(error);
        }
    }

    private handleExceptions(error: any) {
        if (error.code === 11000)
            throw new BadRequestException(
                `El Pokemón ${JSON.stringify(error.keyValue)} ya se encuentra registrado en la base de datos`,
            );

        throw new InternalServerErrorException(error.response.message);
    }
}
