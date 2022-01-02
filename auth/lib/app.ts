
import express, { Application } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import * as cors from 'cors';
import helmet from 'helmet';
import { Server } from 'http';
import path from 'path';

import UserRouter from './routes/userRoute';
import { Directories } from './directories';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

export class App {
    public app: Application;
    constructor(private port: number | string) {
        this.app = express();
        this.middlewares();
        this.config();
        this.routes();
    }
    private config(): void {
        this.app.set('port', this.port);
        // if (!process.env.PRIVATE_KEY || !process.env.BCRYPT_SALT) {
        //     process.exit(1);
        // }
    }
    private middlewares(): void {
        this.app.use(express.static(path.join(Directories.public, 'public')));
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(cors.default());
        this.app.use(helmet());
    }
    async listen(server: Server) {
        try {
            var PORT = this.app.get('port');
            await server.listen(PORT);
            console.log(`Server => listening to port: ${PORT}!`);
        } catch (error) {
            console.log(error);
            process.exit(1);
        }
    }
    async mongoose() {
        try {
            await mongoose.connect("mongodb://auth-mongo-srv:27017");
            mongoose.set('debug', true);
            console.log('Mongoose => connection successful');
        } catch (error) {
            console.error('Mongoose => connection error: ' + error);
            process.exit(1);
        }
    }
    private routes(): void {
        let router: express.Router;
        router = express.Router();
        this.app.use('/', router);
        this.app.use('/api/users', UserRouter);
        this.app.all("*", () => { throw new NotFoundError() })
        this.app.use(errorHandler);
    }
}
