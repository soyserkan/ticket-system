import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '@serkans/status-codes';
import { JoiValidationError, NotFoundError, UnauthorizedError } from '@serkans/error-handler';
import { Publisher, rabbitmq } from '@serkans/rabbitmq-service';

export class OrderController {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (error) {
            next(error);
        }
    }
    public async get(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (error) {
            next(error);
        }
    }
    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (error) {
            next(error);
        }
    }
    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
        } catch (error) {
            next(error);
        }
    }
}