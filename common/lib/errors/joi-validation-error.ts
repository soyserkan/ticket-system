
import { ValidationErrorItem } from 'joi';
import { HttpStatus } from '../enums/status';
import { CustomError } from './custom-error';

export class JoiValidationError extends CustomError {
    statusCode = HttpStatus.BAD_REQUEST;
    constructor(public errors: ValidationErrorItem[]) {
        super("Invalid request parameters");
        Object.setPrototypeOf(this, JoiValidationError.prototype);
    }
    serializeErrors() {
        return this.errors.map(x => {
            return { message: x.message, field: x.path[0] };
        });
    }
}