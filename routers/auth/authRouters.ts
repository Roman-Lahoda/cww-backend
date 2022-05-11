import Router from 'express';
import { signUp, login, logout } from '../../controllers/auth/authController';
import { validateUser } from '../../middlewares/validationUser';
import guard from '../../middlewares/guard';
import google from "../../controllers/auth/authGoogleController"

const router = Router();

router.post('/signup', validateUser, signUp)
router.post('/login', validateUser, login)
router.post('/logout', guard, logout)
router.get('/google', google.googleAuth);
router.get('/google-redirect', google.googleRedirect);


export default router