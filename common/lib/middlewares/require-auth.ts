import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "..";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.currentUser) {
            throw new UnauthorizedError();
        }
        next();
    } catch (error) {
        next();
    }
};