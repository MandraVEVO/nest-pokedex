//aveces se le pone env.config.ts al archivo

export const EnvConfiguration = () => ({ //archivo de configuracion para validar el .ENV
    enviroment: process.env.NODE_ENV || 'dev', // En caso de que noe ste la variable de entorno se le indica que esta en desarrollo
    mongodb: process.env.MONGODB,
    port: process.env.PORT || 3002,
    defaultLimit: +process.env.DEFAULT_LIMIT! || 7, //si tenemos el valor en string lo convertimos a number 
})