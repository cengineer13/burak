import { T } from "../libs/types/common";
import { Request, Response } from 'express';
import MemberService from "../models/Member.service";
import { MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
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

restaurantController.processSignup = async (req: Request, res: Response) => {
    try {
        console.log("Process Signup");
        console.log("body:", req.body);

        const newMember: MemberInput = req.body;
        newMember.memberType = MemberType.RESTAURANT;

        const memberService = new MemberService();
        const result = await memberService.processSignup(newMember);
        res.send("Signup DONE!")
    } catch (err) {
        console.log("Error on goHome:", err);
        res.send(err);
    }
};


export default restaurantController;




