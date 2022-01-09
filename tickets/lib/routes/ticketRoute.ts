import { Router } from 'express';
import { requireAuth } from '@serkans/ticketsystem-common';
import { TicketController } from '../controllers/ticketController';

class TicketRouter {
    router: Router;
    private ticketController: TicketController;
    constructor() {
        this.router = Router();
        this.ticketController = new TicketController();
        this.routes();
    }
    public routes() {
        this.router.post('/', requireAuth, this.ticketController.create);
    }
}

const ticketRoutes = new TicketRouter();
ticketRoutes.routes();
export default ticketRoutes.router;