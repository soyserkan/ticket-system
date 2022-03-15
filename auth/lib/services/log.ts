import { Directories } from "../directories";
import winston, { Logger } from "winston";
import dotenv from 'dotenv';
dotenv.config();

export default class LogService {
    private service: any;
    public logger: Logger;
    constructor(service) {
        this.service = service;
        this.logger = winston.createLogger({
            transports: [new winston.transports.File({ filename: `${Directories.log}/allLogs.log` })],
            format: winston.format.json(),
            defaultMeta: { service: this.service }
        });
        this.setup();
    }
    public setup() {
        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(new winston.transports.Console({ format: winston.format.simple() }));
        }
    }
    // private timeStamp() {
    //     return new Date(Date.now()).toUTCString();
    // };
}