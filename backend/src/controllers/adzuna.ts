import { NextFunction, Request, Response } from 'express';

import ErrorObject from '../utils/ErrorObject';
import { redisSaveWithTtl } from '../db/redis';
import { getRedisKey, REDIS_QUERY_TYPE } from '../db/redisHelper';
import axios from 'axios';
import envKeys from '../config/envKeys';

export async function getAdzunaJobs(req: Request, res: Response, next: NextFunction) {
    try {
        const page = parseInt(req.params.page);
        const itemsPerPage = parseInt(req.params.itemsPerPage);

        if (!page || !itemsPerPage || isNaN(page) || isNaN(itemsPerPage)) {
            throw new Error(`page or itemsPerPage is undefined/null. Cant get Adzuna jobs available for student to take.`);
        }

        const adzunaResults = await axios.get(`https://api.adzuna.com/v1/api/jobs/in/search/${page}?app_id=${envKeys.ADZUNA_ID}&app_key=${envKeys.ADZUNA_KEY}&results_per_page=${itemsPerPage}&category=it-jobs`);

        if (adzunaResults.data.count === 0) {
            return next(new ErrorObject(400, 'No available jobs on Adzuna.'));
        }

        await redisSaveWithTtl(getRedisKey(REDIS_QUERY_TYPE.GET_ADZUNA_JOBS_LIMIT_OFFSET, req), adzunaResults.data, 60 * 60); // 1hr TTL
        return res.status(200).send({ success: 'true', message: 'Fetched adzuna jobs successfully', data: adzunaResults.data });
    } catch (e) {
        console.log('Fetching Adzuna jobs failed: ', e);
        next(new ErrorObject(500, `Something went wrong in fetching Adzuna jobs! ${e}`));
    }

}