import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


export function checkUser(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.session?.jwt) {
            return next();
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