import { Router, Request, Response } from "express";
import { login, logout, register, user } from '../../controllers/authController';
import { forgot, reset } from '../../controllers/forgotController';
import checkRecaptcha from '../../middlewares/checkRecaptcha';
import { validationFactory } from "../../middlewares/validateInputs";

import { registerValidation, loginValidation, forgotValidation, resetValidation } from "../../models/validationModels";

export function configureRouter(router: Router) {
    router.get('/',(req:Request,res:Response)=> res.send('Welcome'));
    router.post('/api/v1/register', validationFactory(registerValidation), checkRecaptcha, register);
    router.post('/api/v1/login', validationFactory(loginValidation), checkRecaptcha, login);
    router.get('/api/v1/user',user);
    router.post('/api/v1/logout', logout);

    router.post('/api/v1/forgot', validationFactory(forgotValidation), forgot);
    router.post('/api/v1/reset', validationFactory(resetValidation), reset);
}
