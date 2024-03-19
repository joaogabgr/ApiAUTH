import 'reflect-metadata'
import { DataSource } from 'typeorm'
import User from '../entities/User'
import { CreateUsersTable1710863286629 } from './migrations/1710863286629-CreateUsersTable'

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "Nc321654987",
    database: "jwt",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [CreateUsersTable1710863286629],
    subscribers: []
})