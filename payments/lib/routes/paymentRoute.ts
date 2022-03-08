import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController';
import { requireAuth } from '../middlewares/require-auth';

class PaymentRouter {
    router: Router;
    private paymentController: PaymentController;
    constructor() {
        this.router = Router();
        this.paymentController = new PaymentController();
        this.routes();
    }
    public routes() {
        this.router.post('/', requireAuth, this.paymentController.create);
        this.router.get('/:id', requireAuth, this.paymentController.get);
        this.router.get('/', requireAuth, this.paymentController.getAll);
        this.router.put('/:id', requireAuth, this.paymentController.update);
    }
}

const paymentRoutes = new PaymentRouter();
paymentRoutes.routes();
export default paymentRoutes.router;