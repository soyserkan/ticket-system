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
            new Publisher(rabbitmq.channel).publish("order:create", {
                id: order.id,
                status: order.status,
                userId: order.userId,
                expiresAt: (order.expiresAt as any).toISOString(),
                ticket: {
                    id: ticket.id,
                    price: ticket.price
                }
            })
            res.status(HttpStatus.CREATED).send(order);
        } catch (error) {
            next(error);
        }
    }
    public async get(req: Request, res: Response, next: NextFunction) {
        try {
            const order = await Order.findOne({ userId: req.currentUser?.id, id: req.body.id }).populate('ticket');
            if (order) {
                res.status(HttpStatus.OK).send(order);
            } else {
                throw new NotFoundError();
            }
        } catch (error) {
            next(error);
        }
    }
    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const orders = await Order.find({ userId: req.currentUser?.id }).populate('ticket');
            if (orders) {
                res.status(HttpStatus.OK).send(orders);
            } else {
                throw new NotFoundError();
            }
        } catch (error) {
            next(error);
        }
    }
    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const order = await Order.findOne({ userId: req.currentUser?.id, id: req.body.id }).populate('ticket');
            if (order) {
                order.status = OrderStatus.Cancelled;
                await order.save();
                new Publisher(rabbitmq.channel).publish("order:cancel", {
                    id: order.id,
                    ticket: {
                        id: order.ticket.id,
                    }
                })
                res.status(HttpStatus.OK).send(order);
            } else {
                throw new NotFoundError();
            }
        } catch (error) {
            next(error);
        }
    }
}