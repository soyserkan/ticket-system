import { JoiValidationError, NotFoundError, UnauthorizedError } from '@serkans/error-handler';
import { NextFunction, Request, Response } from 'express';
import { orderValidation } from '../validations/order';
import Order from '../models/order';
import Payment from '../models/payment';
import { OrderStatus } from '../types/order-status';
import { stripe } from '../services/stripe';
import { Publisher, rabbitmq } from '@serkans/rabbitmq-service';
import { QueueName } from '../types/queue-names';
//asd
export class PaymentController {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const validate = orderValidation(req.body);
            if (validate) {
                if (!validate.error) {
                    const { token, orderId } = req.body;
                    const order = await Order.findById(orderId);
                    if (!order) {
                        throw new NotFoundError();
                    }
                    if (order.userId !== req.currentUser!.id) {
                        throw new UnauthorizedError();
                    }
                    if (order.status === OrderStatus.Cancelled) {
                        throw new Error("cannot edit a reserved ticket");
                    }
                    // const charge = await stripe.charges.create({ currency: 'usd', amount: order.price * 100, source: token });
                    const charge = { id: Math.random() }
                    if (charge) {
                        const payment = await Payment.create({ orderId, stripeId: charge.id });
                        if (payment) {
                            await new Publisher(rabbitmq.channel).publish(QueueName.PAYMENT_CREATE, {
                                id: payment.id,
                                orderId: orderId,
                                stripeId: charge.id
                            });
                        }
                    }
                    res.send({ succeess: true })
                } else {
                    throw new JoiValidationError(validate.error.details);
                }
            }
        } catch (error) {
            console.log(error);
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
    public async update(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (error) {
            next(error);
        }
    }
}