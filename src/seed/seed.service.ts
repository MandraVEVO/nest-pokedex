import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  
  // private readonly axios: AxiosInstance = axios;
  //provider a continuacion

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http:AxiosAdapter
  ){}
  async executeSeed() {

    await this.pokemonModel.deleteMany({}); //eliminar todos los registros de la base de datos

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650') //esto crea una dependencia oculta 
    
    const pokemonToInsert: {name: string, no: number}[] = [];

    data.results.forEach(async ({name,url}) => {
      const segments = url.split('/');
      const no:number = +segments[ segments.length - 2 ];

      // const pokemon = await this.pokemonModel.create({name, no}); //cuando son mas registros no es tan optimo usar await
      pokemonToInsert.push({name, no}); //se guarda en un array para insertar todos los registros a la vez

     
    });

    await this.pokemonModel.insertMany(pokemonToInsert); //insertar todos los registros a la vez
    // insert into pokemons (name,no)
    // (name: 'pikachu', no: 1),
    // (name: 'bulbasaur', no: 2),
    // (name: 'charmander', no: 3)
    return 'SEED EXECUTED';
  }

  
}
