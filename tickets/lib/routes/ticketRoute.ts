import { Router } from 'express';
import { TicketController } from '../controllers/ticketController';
import { requireAuth } from '../middlewares/require-auth';

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
        this.router.get('/:id', requireAuth, this.ticketController.get);
        this.router.get('/', requireAuth, this.ticketController.getAll);
        this.router.put('/:id', requireAuth, this.ticketController.update);
    }
}

const ticketRoutes = new TicketRouter();
ticketRoutes.routes();
export default ticketRoutes.router;