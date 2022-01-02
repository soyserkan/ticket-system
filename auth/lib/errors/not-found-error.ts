import { HttpStatus } from "../enums/status";
import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
    statusCode = HttpStatus.NOT_FOUND;
    constructor() {
        super("Not Found");
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serializeErrors() {
        return [{ message: 'Not Found!' }]
    }
}