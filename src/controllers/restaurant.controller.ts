import { T } from "../libs/types/common";
import { Request, Response } from 'express';
import MemberService from "../models/Member.service";
const restaurantController: T = {};

restaurantController.goHome = (req: Request, res: Response) => {
    try {
        console.log("goHome")
        // LOGIC
        //SERVICE MODEL va xokazo ... (yoziladi)
        res.send("You are on Admin homepage");
        // response: send | json | redirect | end | render
    } catch (err) {
        console.log("Error on goHome:", err)
    }
};

restaurantController.getLogin = (req: Request, res: Response) => {
    try {
        console.log("getLogin")
        res.send("Login Admin page")
    } catch (err) {
        console.log("Error on goHome:", err)
    }
};

restaurantController.processLogin = (req: Request, res: Response) => {
    try {
        console.log("Process Login");
        res.send("Login DONE!")
    } catch (err) {
        console.log("Error on goHome:", err);
    }
};

restaurantController.getSignup = (req: Request, res: Response) => {
    try {
        res.send("Admin Signup page")
    } catch (err) {
        console.log("Error on goHome:", err)
    }
};

restaurantController.processSignup = (req: Request, res: Response) => {
    try {
        console.log("Process Signup");
        res.send("Signup DONE!")
    } catch (err) {
        console.log("Error on goHome:", err);
    }
};


export default restaurantController;




