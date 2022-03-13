import { NextFunction, Request, Response } from 'express';
import Ticket from '../models/ticket';
import Order, { OrderAttr } from '../models/order';
import { HttpStatus } from '@serkans/status-codes';
import { NotFoundError } from '@serkans/error-handler';
import { Publisher, rabbitmq } from '@serkans/rabbitmq-service';
import { OrderStatus } from '../types/order-status';
import { QueueName } from '../types/queue-names';


export class OrderController {

//
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const ticket = await Ticket.findById(req.body.ticketId);
            if (!ticket) {
                console.log("ticket not found")
                throw new NotFoundError();
            }
            const isReserved = await ticket.isReserved();
            if (isReserved) {
                throw new Error("Ticket is already reserved");
            }
            const expiration = new Date();
            expiration.setSeconds(expiration.getSeconds() + 1 * 60);

            const order = await Order.create({ userId: req.currentUser?.id, ticket: ticket, expiresAt: expiration });

            console.log(order.id);

            await new Publisher(rabbitmq.channel).publish(QueueName.ORDER_CREATE, {
                id: order.id,
                version: order.version,
                status: order.status,
                userId: order.userId,
                expiresAt: (order.expiresAt as any).toISOString(),
                ticket: {
                    id: ticket.id,
                    price: ticket.price
                }
            } as OrderAttr)

            res.status(HttpStatus.CREATED).send(order);
        } catch (error) {
            next(error);
        }
    }
    public async get(req: Request, res: Response, next: NextFunction) {
        try {
            const order = await Order.findOne({ userId: req.currentUser?.id, _id: req.params.id }).populate('ticket');
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
            const order = await Order.findOne({ userId: req.currentUser?.id, _id: req.body.id }).populate('ticket');
            if (order) {
                order.status = OrderStatus.Cancelled;
                await order.save();
                await new Publisher(rabbitmq.channel).publish(QueueName.ORDER_CANCEL, {
                    id: order.id,
                    version: order.version,
                    ticket: {
                        id: order.ticket.id,
                    }
                } as OrderAttr)
                res.status(HttpStatus.OK).send(order);
            } else {
                throw new NotFoundError();
            }
        } catch (error) {
            next(error);
        }
    }
}