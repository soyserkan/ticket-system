import { HttpStatus } from "../enums/status";
import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
    statusCode = HttpStatus.INTERVAL_SERVER_ERROR;
    reason = "Error connection to database";
    constructor() {
        super("Error connection to db");

        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
    serializeErrors() {
        return [{ message: this.reason }]
    }
}