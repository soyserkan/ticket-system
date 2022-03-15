
import express, { Application } from 'express';
import mongoose from 'mongoose';
//import bodyParser from 'body-parser';
import * as cors from 'cors';
import helmet from 'helmet';
import { Server } from 'http';
import path from 'path';
import cookieSession from 'cookie-session';
import UserRouter from './routes/userRoute';
import { Directories } from './directories';
import { ConnectionError, ErrorHandlerMiddleware, NotFoundError } from '@serkans/error-handler';

//asdf
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
        this.app.set('trust proxy', true);
        if (!process.env.JWT_KEY) {
            throw new NotFoundError("JWT_KEY not found!");
        }
    }
    private middlewares(): void {
        this.app.use(express.static(path.join(Directories.public, 'public')));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        this.app.use(cors.default());
        this.app.use(helmet());
        this.app.use(cookieSession({ signed: false, secure: false }));
    }
    async listen(server: Server) {
        try {
            var PORT = this.app.get('port');
            await server.listen(PORT);
            console.log(`Server => listening to port: ${PORT}!`);
        } catch (error) {
            throw new ConnectionError(JSON.stringify(error));
        }
    }
    async mongoose() {
        try {
            if (process.env.MONGO_URI) {
                await mongoose.connect(process.env.MONGO_URI, { tlsInsecure: true });
                mongoose.set('debug', true);
                console.log('Mongoose => connection successful');
            } else {
                console.error('Mongoose => connection uri not found');
            }
        } catch (error) {
            throw new ConnectionError(JSON.stringify(error));
        }
    }
    private routes(): void {
        let router: express.Router;
        router = express.Router();
        this.app.use('/', router);
        this.app.use('/api/users', UserRouter);
        this.app.all("*", () => { throw new NotFoundError("Route not found!") })
        this.app.use(ErrorHandlerMiddleware);
    }
}
