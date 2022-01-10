import { NextFunction, Request, Response } from 'express';
import Ticket, { ticketValidation } from '../models/ticket';
import { HttpStatus } from '@serkans/status-codes';
import { JoiValidationError } from '@serkans/error-handler';

export class TicketController {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const validate = ticketValidation(req.body);
            if (validate) {
                if (!validate.error) {
                    const { title, price } = req.body
                    const new_ticket = await new Ticket({ title, price, userId: req.currentUser.id }).save();
                    if (new_ticket) {
                        res.status(HttpStatus.CREATED).send({ new_ticket });
                    }
                } else {
                    throw new JoiValidationError(validate.error.details);
                }
            }
        } catch (error) {
            next(error);
        }
    }
}