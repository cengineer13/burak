import expres, { Request, Response } from 'express';

const router = expres.Router();


router.get("/", (req: Request, res: Response) => {
    res.send("You are on homepage")
});

router.get("/login", (req: Request, res: Response) => {
    res.send("Login page")
});

router.get("/signup", (req: Request, res: Response) => {
    res.send("Signup page")
});

export default router;