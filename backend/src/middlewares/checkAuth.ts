import {Request, NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as KEYS from '../config/envKeys';
import ErrorObject from '../utils/ErrorObject';

export type UserData = {_id:string};

export default async function checkAuth(req: Request, res: Response, next: NextFunction){
    // Header contains=> Authorization: 'Bearer TOKEN'
    try{
        // Whether Auth Header object exists with jwt string:
        const jwtToken = req.headers.authorization?.split(' ')[1];
        if (!jwtToken) {
            return next(new ErrorObject(401,'Authentication failed. Please log-in.'));
        }

        // Can it be successfully to uuid:
        const decodedToken:any = jwt.verify(jwtToken, KEYS.JWT_SECRET || 'secret_key');
        if (!decodedToken || !decodedToken._id) {
            return next(new ErrorObject(401,'Authentication failed. Please log-in.'));
        }

        // Attach decoded uuid to req and move to next function.
        req.userData = {_id:decodedToken._id};
        next();

    }catch(err){
        console.error('Error in jwt check Auth middleware', err);
        return next(new ErrorObject(500,'Authentication failed'));
    }
};