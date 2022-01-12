import { UnauthorizedError } from "@serkans/error-handler";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function currentUser(req: Request, res: Response, next: NextFunction) {
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