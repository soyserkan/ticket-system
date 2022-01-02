import { HttpStatus } from "../enums/status";

export abstract class CustomError extends Error {
    abstract statusCode: HttpStatus;
    /**
     *
     */
    constructor(message) {
        super(message);

        Object.setPrototypeOf(this, CustomError.prototype);
    }
    abstract serializeErrors(): { message: string, field?: string | number }[];
}