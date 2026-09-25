import expres, { Request, Response } from 'express';
import restaurantController from './controllers/restaurant.controller';
const routerAdmin = expres.Router();


routerAdmin.get("/", restaurantController.goHome);

routerAdmin.get("/login", restaurantController.getLogin);
routerAdmin.get("/signup", restaurantController.getSignup);

export default routerAdmin;