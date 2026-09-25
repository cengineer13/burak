import { T } from "../libs/types/common";
import { Request, Response } from 'express';
import MemberService from "../models/Member.service";
const restaurantController: T = {};

restaurantController.goHome = (req: Request, res: Response) => {
    try {
        res.send("You are on Admin homepage");
    } catch (err) {
        console.log("Error on goHome:", err)
    }
};

restaurantController.getLogin = (req: Request, res: Response) => {
    try {
        res.send("Login Admin page")
    } catch (err) {
        console.log("Error on goHome:", err)
    }
};

restaurantController.getSignup = (req: Request, res: Response) => {
    try {
        res.send("Signup page")
    } catch (err) {
        console.log("Error on goHome:", err)
    }
};

export default restaurantController;




