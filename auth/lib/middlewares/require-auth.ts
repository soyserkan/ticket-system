import { UnauthorizedError } from "@serkans/error-handler";
import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.currentUser) {
        throw new UnauthorizedError();
    }
    next();
};