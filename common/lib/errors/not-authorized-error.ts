import { HttpStatus } from "../enums/status";
import { CustomError } from "./custom-error";

export class UnauthorizedError extends CustomError {
    statusCode = HttpStatus.UNAUTHORIZED;
    constructor() {
        super("Unauthorized");
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
    serializeErrors() {
        return [{ message: 'Unauthorized!' }]
    }
}