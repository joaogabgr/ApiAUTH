import 'reflect-metadata'
import express from 'express'
import cors from "cors"
import { AppDataSource } from './database/data-source'
import bodyParser from 'body-parser';
import session from 'express-session';

import auth from './App/routes/auth'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

AppDataSource.initialize().then(async () => {
    console.log("Conectado ão banco");

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true
    }));

    app.use('/', auth)

    app.listen(port, () => {
        console.log("Servidor iniciado");
    })
}).catch(error => {
    throw error
})