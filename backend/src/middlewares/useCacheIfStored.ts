import { NextFunction, Request, Response } from "express";

import { redisGet } from "../db/redis";
import { getRedisKey, REDIS_QUERY_TYPE } from "../db/redisHelper";
import ErrorObject from "../utils/ErrorObject";

export function useCacheIfStored(queryType: REDIS_QUERY_TYPE, successMessage: string = 'Successfully retrieved from Cache!') {
    return async function cacheData(req: Request, res: Response, next: NextFunction) {
        const cacheKey = getRedisKey(queryType, req);
        try {
            const cacheResults = await redisGet(cacheKey);
            if (cacheResults) {
                let results = JSON.parse(cacheResults);

                res.send({
                    message: results.message || successMessage,
                    success: results.success || 'true',
                    fromCache: true,
                    data: results.data || results,
                    meta: results.meta,
                });
            } else {
                next();
            }
        } catch (e) {
            console.log('Error in Cache get: ', e);
            next(new ErrorObject(500, `Something went wrong in Cache!${e}`));
        }
    }
}