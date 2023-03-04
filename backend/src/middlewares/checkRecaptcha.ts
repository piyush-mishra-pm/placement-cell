import axios from "axios";
import { NextFunction, Request, Response } from "express";

import ErrorObject from '../utils/ErrorObject';
import envKeys, * as KEYS from '../config/envKeys';

export default function checkRecaptcha(req:Request,res:Response,next:NextFunction) {
    const enabled = envKeys.ENABLE_RECAPTCHA;
    if (!enabled || enabled.toLocaleLowerCase()!=='true'){
        return next();
    }
    else {
        return (async function checkRecaptcha(req: Request, res: Response, next: NextFunction) {

        if (!req.body.captcha) {
            return next(new ErrorObject(400, 'Missing Re-Captcha.'));
        }
    
        const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${KEYS.GOOGLE_RECAPTCA_SECRET_KEY}&response=${req.body.captcha}&remoteip=${req.socket.remoteAddress}`;
        try {
            const verificationReponse = await axios.post(verificationUrl);
            if (!verificationReponse.data.success) {
                return next(new ErrorObject(400, 'Invalid Re-Captcha verification.'));
            }
            return next();
        } catch (err) {
            return next(new ErrorObject(500, 'Something wrong happened during Re-Captcha verification.'));
        }
    });
}
}