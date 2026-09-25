import expres, { Request, Response } from 'express';
import memberController from './controllers/member.controller';
const router = expres.Router();


router.get("/", memberController.goHome);

router.get("/login", memberController.getLogin);
router.get("/signup", memberController.getSignup);


export default router;