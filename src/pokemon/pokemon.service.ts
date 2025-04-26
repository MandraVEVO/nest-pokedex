import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { env } from 'process';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  
  private defaultLimit: number;

  constructor(
    
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService,

    
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit') ?? 10; // Provide a fallback value of 10
    // console.log({defaultLimit: configService.get<number>('defaultLimit')});
  }


  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;
      
    } catch (error) {
      this.handleExceptions( error );
    }

  }



  findAll(paginationDto: PaginationDto) {

    const { limit = this.defaultLimit, offset = 0} = paginationDto;
    return this.pokemonModel.find()
    .limit(limit) //solo trae 10 en 10
    .skip(offset)//los siguientes 5
    .sort({ no: 1 }) //ordena por el campo no de manera ascendente
    .select('-__v'); //quita el campo __v
  }

  async findOne(term: string) {
    
    let pokemon: Pokemon | null = null;

    if ( !isNaN(+term) ) {
      pokemon = await this.pokemonModel.findOne({ no: term }) as Pokemon | null;
    }

    // MongoID
    if ( !pokemon && isValidObjectId( term ) ) {
      pokemon = await this.pokemonModel.findById( term );
    }

    // Name
    if ( !pokemon ) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() });
    }


    if ( !pokemon ) 
      throw new NotFoundException(`Pokemon with id, name or no "${ term }" not found`);
    

    return pokemon;
  }

  async update( term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne( term );



    if(updatePokemonDto.name){
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

    }

    try {
      await pokemon.updateOne( updatePokemonDto ); //sirve para que el objeto tenga nuevos datos
    return { ...pokemon.toJSON(), ...updatePokemonDto }; //sirve para que el objeto tenga nuevos datos
    
    } catch (error) {
      this.handleExceptions( error );
    }
    
  }

  async remove( id: string) {
    // const pokemon = await this.findOne( id );
    // await pokemon.deleteOne();
    // return { id };

    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id} );
    
    
    if ( deletedCount === 0 ) { //para que solo elimine una vez 
      throw new BadRequestException(`Pokemon with id "${ id }" not found`);
    }
    return;
  }


  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`Pokemon exists in db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
  }
}