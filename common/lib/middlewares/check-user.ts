import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

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
            throw new Error("user not authorized");
        }
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY);
        req.currentUser = payload;
        if (!req.currentUser) {
            throw new Error("user not authorized");
        }
        next();
    } catch (error) {
        next(error);
    }
}