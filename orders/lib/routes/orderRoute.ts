import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { requireAuth } from '../middlewares/require-auth';

class OrderRouter {
    router: Router;
    private orderController: OrderController;
    constructor() {
        this.router = Router();
        this.orderController = new OrderController();
        this.routes();
    }
    public routes() {
        this.router.post('/', requireAuth, this.orderController.create);
        this.router.get('/:id', requireAuth, this.orderController.get);
        this.router.get('/', requireAuth, this.orderController.getAll);
        this.router.patch('/:id', requireAuth, this.orderController.delete);
    }
}

const orderRoutes = new OrderRouter();
orderRoutes.routes();
export default orderRoutes.router;