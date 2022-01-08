import { NextFunction, Response, Request } from "express";
import { HttpStatus } from "../enums/status";
import { CustomError } from "../errors/custom-error";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }
    res.status(HttpStatus.BAD_REQUEST).send({ errors: [{ mesage: err.message }] });
}