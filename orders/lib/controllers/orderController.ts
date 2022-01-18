import { NextFunction, Request, Response } from 'express';
import Ticket from '../models/ticket';
import Order from '../models/order';
import { HttpStatus } from '@serkans/status-codes';
import { JoiValidationError, NotFoundError, UnauthorizedError } from '@serkans/error-handler';
import { Publisher, rabbitmq } from '@serkans/rabbitmq-service';
import { OrderStatus } from '../types/order-status';


export class OrderController {

    //EXPIRATION_WINDOW_SECONDS = 15 * 60;

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const ticket = await Ticket.findById(req.body.ticketId);
            if (!ticket) {
                throw new NotFoundError();
            }
            const isReserved = await ticket.isReserved();
            if (isReserved) {
                throw new Error("Ticket is already reserved");
            }
            // const expiration = new Date();
            // expiration.setSeconds(expiration.getSeconds() + this.EXPIRATION_WINDOW_SECONDS);
            const order = await Order.create({ userId: req.currentUser?.id, ticket: ticket });
            res.status(HttpStatus.CREATED).send(order);
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