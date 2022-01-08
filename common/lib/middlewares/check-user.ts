import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { NotFoundError, UnauthorizedError } from "..";

declare global {
    namespace Express {
        export interface Request {
            currentUser?: any;
        }
        export interface Response {
            currentUser?: any;
        }
    }
}


export function checkUser(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.session?.jwt) {
            throw new UnauthorizedError();
        }
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY);
        req.currentUser = payload;
        if (!req.currentUser) {
            throw new UnauthorizedError();
        }
        next();
    } catch (error) {
        next(error);
    }
}