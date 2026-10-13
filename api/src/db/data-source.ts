import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSource, DataSourceOptions } from "typeorm";



// used inside  NestJS app for the TypeOrmModule.forRootAsync() call.
export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async( configService:ConfigService): Promise<TypeOrmModuleOptions> => ({
        type: 'postgres',
        host: configService.get<string>('db_host'),
        port: configService.get<number>('db_port'),
        username: configService.get<string>('db_username'),
        password: configService.get<string>('db_password'),
        database: configService.get<string>('db_name'),
        autoLoadEntities: true,
        synchronize: false,
        migrations: ["dist/db/migrations/*.js"]
    })
}


// used outside NestJS, specifically by the TypeORM CLI.
export const dataSourceOptions: DataSourceOptions = {
    type:"postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [],
    synchronize: false,
    migrations: ['dist/db/migrations/*.js'],
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource