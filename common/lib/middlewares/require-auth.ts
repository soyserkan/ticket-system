import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "..";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.currentUser) {
        throw new UnauthorizedError();
    }
    next();
};