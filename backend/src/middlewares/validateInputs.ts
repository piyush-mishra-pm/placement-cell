import ErrorObject from "../utils/ErrorObject";
import { Request, Response, NextFunction } from "express";

export function validationFactory(validationObject: any) {
    return async function validationMiddleware(req: Request, res: Response, next: NextFunction) {
        try {
            // Validation errors:
            await validationObject.validateAsync(req.body);
        }
        catch (e: any) {
            return next(new ErrorObject(400, `Invalid inputs: ${e.message}`));
        }
        next();
    }
}