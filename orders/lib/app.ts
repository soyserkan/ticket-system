
import express, { Application } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import * as cors from 'cors';
import helmet from 'helmet';
import { Server } from 'http';
import path from 'path';
import cookieSession from 'cookie-session';
import { rabbitmq } from '@serkans/rabbitmq-service';
import { NotFoundError } from '@serkans/error-handler';

import OrderRouter from './routes/orderRoute'
import { Directories } from './directories';
import { errorHandler } from './middlewares/error-handler';
import { currentUser } from './middlewares/current-user';

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
            throw new Error("jwt key not found");
        }
    }
    private middlewares(): void {
        this.app.use(express.static(path.join(Directories.public, 'public')));
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(cors.default());
        this.app.use(helmet());
        this.app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' }));
    }
    async listen(server: Server) {
        try {
            var PORT = this.app.get('port');
            await server.listen(PORT);
            console.log(`[Express] server listening to port: ${PORT}!`);
        } catch (error) {
            console.log(error);
            process.exit(1);
        }
    }
    async rabbitmq(url: string | undefined) {
        try {
            if (url) {
                await rabbitmq.connect(url);
                console.log('[RabbitMQ] connection successful');
            } else {
                console.error('[RabbitMQ] connection uri not found');
            }
        } catch (error) {
            console.log('[RabbitMQ] connection error: ' + error);
            process.exit(1);
        }
    }
    async mongoose(url: string | undefined) {
        try {
            if (url) {
                await mongoose.connect(url);
                console.log('[MongoDB] connection successful');
            } else {
                console.error('[MongoDB] connection uri not found');
            }
        } catch (error) {
            console.error('[MongoDB] connection error: ' + error);
            process.exit(1);
        }
    }
    private routes(): void {
        let router: express.Router;
        router = express.Router();
        this.app.use('/', router);
        this.app.use(currentUser);
        this.app.use('/api/orders', OrderRouter);
        this.app.all("*", () => { throw new NotFoundError() })
        this.app.use(errorHandler);
    }
}
