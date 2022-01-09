import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { currentUser } from '@serkans/ticketsystem-common';

class UserRouter {
    router: Router;
    private userController: UserController;
    constructor() {
        this.router = Router();
        this.userController = new UserController();
        this.routes();
    }
    public routes() {
        this.router.get('/currentuser', currentUser, this.userController.getCurrentUser);
        this.router.post('/signin', this.userController.signin);
        this.router.post('/signup', this.userController.signup);
        this.router.post('/signout', this.userController.signout);


        this.router.post('/changePassword/sendEmail', this.userController.sendResetEmail);
        this.router.post('/changePassword/reset', this.userController.resetPassword);
    }
}

const userRoutes = new UserRouter();
userRoutes.routes();
export default userRoutes.router;