import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {  UnauthorizedError } from "..";

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
            console.log("1");
            throw new UnauthorizedError();
        }
        const payload = jwt.verify(req.session.jwt, "mysecretkey");
        req.currentUser = payload;
        if (!req.currentUser) {
            console.log("2");
            throw new UnauthorizedError();
        }
        next();
    } catch (error) {
        next(error);
    }
}