import { Router } from 'express';
import { UserController } from '../controllers/userController';

class UserRouter {
    router: Router;
    private userController: UserController;
    constructor() {
        this.router = Router();
        this.userController = new UserController();
        this.routes();
    }
    public routes() {
        this.router.get('/currentuser', this.userController.getCurrentUser);
        this.router.post('/signin', this.userController.login);
        this.router.post('/signup', this.userController.signup);
        this.router.post('/signout', this.userController.signout);


        this.router.post('/changePassword/sendEmail', this.userController.sendResetEmail);
        this.router.post('/changePassword/reset', this.userController.resetPassword);
        this.router.get('/:email', this.userController.getUserByEmail);
        this.router.put('/:id', this.userController.updateUser);
    }
}

const userRoutes = new UserRouter();
userRoutes.routes();
export default userRoutes.router;