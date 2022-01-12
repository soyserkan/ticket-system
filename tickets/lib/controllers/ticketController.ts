import { NextFunction, Request, Response } from 'express';
import Ticket, { ticketValidation } from '../models/ticket';
import { HttpStatus } from '@serkans/status-codes';
import { JoiValidationError, NotFoundError, UnauthorizedError } from '@serkans/error-handler';

export class TicketController {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const validate = ticketValidation(req.body);
            if (validate) {
                if (!validate.error) {
                    const { title, price } = req.body
                    const new_ticket = await new Ticket({ title, price, userId: req.currentUser?.id }).save();
                    if (new_ticket) {
                        res.status(HttpStatus.CREATED).send(new_ticket);
                    }
                } else {
                    throw new JoiValidationError(validate.error.details);
                }
            }
        } catch (error) {
            next(error);
        }
    }
    public async get(req: Request, res: Response, next: NextFunction) {
        try {
            const ticket = await Ticket.findById(req.params.id);
            if (ticket) {
                res.status(HttpStatus.OK).send(ticket);
            } else {
                throw new NotFoundError();
            }
        } catch (error) {
            next(error);
        }
    }
    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const tickets = await Ticket.find({});
            if (tickets && tickets.length > 0) {
                res.status(HttpStatus.OK).send(tickets);
            } else {
                throw new NotFoundError();
            }
        } catch (error) {
            next(error);
        }
    }
    public async update(req: Request, res: Response, next: NextFunction) {
        try {
            const ticket = await Ticket.findById(req.params.id);
            if (!ticket) {
                throw new NotFoundError();
            }
            if (ticket.userId !== req.currentUser?.id) {
                throw new UnauthorizedError();
            }
            if (ticket) {
                const validate = ticketValidation(req.body);
                if (validate) {
                    ticket.set({ title: req.body.title, price: req.body.price });
                    await ticket.save();
                    res.status(HttpStatus.OK).send(ticket);
                } else {
                    throw new JoiValidationError(validate);
                }
            }
        } catch (error) {
            next(error);
        }
    }
}