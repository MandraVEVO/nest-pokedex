import { join } from 'path'; // en Node
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';

import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { env } from 'process';

@Module({
  imports: [

    ConfigModule.forRoot(
    ), //para que lea el archivo .env 
    
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'), 
    }),

    MongooseModule.forRoot(process.env.MONGODB), //para conectar a la base de datos

    PokemonModule,

    CommonModule,

    SeedModule,

   

  ],
})
export class AppModule {
  constructor() {
    console.log(process.env);
  }
}