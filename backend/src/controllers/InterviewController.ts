import { NextFunction, Request, Response } from 'express';

import pgDb from '../db/pg';
import ErrorObject from '../utils/ErrorObject';
import { redisDeleteKey, redisGet, redisSaveWithTtl } from '../db/redis';
import { getRedisKey, REDIS_QUERY_TYPE } from '../db/redisHelper';

const QUERY_GET_ALL_INTERVIEWS =
    `SELECT
        interview_id,
        company_name,
        interview_name,
        description,
        time,
        interview_status,
        student_id,
        first_name, last_name,
        batch
    FROM interviews AS int
    LEFT JOIN sessions ss USING(interview_id)
    LEFT JOIN students st USING (student_id)`;

export async function getAllInterviews(req: Request, res: Response, next: NextFunction) {
    const page = parseInt(req.params.page);
    const itemsPerPage = parseInt(req.params.itemsPerPage);

    try {
        const results = await pgDb.query(
            `${QUERY_GET_ALL_INTERVIEWS}
            ORDER BY int.interview_id DESC,ss.student_id DESC
            LIMIT $1 OFFSET $2`,
            [itemsPerPage, (page - 1) * itemsPerPage]);
        if (results.rows.length === 0) {
            return next(new ErrorObject(400, 'No Interviews results!'));
        }

        // For Pagination: Cached exists for total student result count? (Expensive query so caching used).
        const cachedTotalInterviewCount = await redisGet(REDIS_QUERY_TYPE.INTERVIEWS_COUNT_GET);
        if (cachedTotalInterviewCount) {
            return res.status(200).send({ success: 'true', message: 'Fetched interview records successfully', data: results.rows, meta: { numPages: Math.ceil(cachedTotalInterviewCount / itemsPerPage), count: cachedTotalInterviewCount } });
        }

        // For Pagination: Cached didnt exist, so query and store result in cache? (Expensive query so caching used).
        const countResults = await pgDb.query(QUERY_GET_ALL_INTERVIEWS);
        await redisSaveWithTtl(getRedisKey(REDIS_QUERY_TYPE.INTERVIEWS_COUNT_GET, req), countResults.rows.length, 60);// 1minute

        const responseObject = {
            success: 'true',
            message: 'Fetched Interview records successfully',
            data: results.rows,
            meta: {
                numPages: Math.ceil(countResults.rows.length / itemsPerPage),
                count: countResults.rows.length
            }
        };

        // Save in Cache:
        await redisSaveWithTtl(getRedisKey(REDIS_QUERY_TYPE.INTERVIEWS_GET, req), responseObject, 10);
        return res.status(200).send(responseObject);
    } catch (e) {
        console.log('getAllInterviews failed: ', e);
        next(new ErrorObject(500, `Something went wrong in getAllInterviews!${e}`));
    }
}

export async function getInterview(req: Request, res: Response, next: NextFunction) {
    const { interviewId } = req.params;
    try {
        const results = await pgDb.query('SELECT * FROM interviews WHERE interview_id=$1', [interviewId]);
        // todo: append interview details of Interview as well.
        if (results.rows.length === 0) {
            return next(new ErrorObject(400, 'No such interview found'));
        }
        const responseObject = { success: 'true', message: 'Successfully fetched Interview details.', data: results.rows[0] };
        // Save in Cache:
        await redisSaveWithTtl(getRedisKey(REDIS_QUERY_TYPE.INTERVIEW_GET, req), responseObject, 10);
        return res.status(200).send(responseObject);
    } catch (e) {
        console.log('getInterview failed: ', e);
        next(new ErrorObject(500, `Something went wrong in getInterview!${e}`));
    }
}

export async function createInterview(req: Request, res: Response, next: NextFunction) {
    const { company_name, interview_name, description, time } = req.body;

    try {
        const results = await pgDb.query('INSERT INTO interviews(company_name, interview_name, description, time) VALUES($1, $2, $3, $4) RETURNING *', [company_name, interview_name, description, time]);
        return res.status(200).send({ success: 'true', message: 'Created Interview successfully', data: results.rows });
    } catch (e) {
        console.log('Create Interview failed: ', e);
        next(new ErrorObject(500, `Something went wrong in createInterview!${e}`));
    }
}

export async function updateInterview(req: Request, res: Response, next: NextFunction) {
    const { company_name, interview_name, description, time } = req.body;
    const { interviewId } = req.params;

    try {
        const results = await pgDb.query('UPDATE interviews SET company_name=$1, interview_name=$2, description=$3, time=$4 WHERE interview_id=$5', [company_name, interview_name, description, time, interviewId]);
        await redisDeleteKey(getRedisKey(REDIS_QUERY_TYPE.INTERVIEW_GET, req));
        await redisDeleteKey(getRedisKey(REDIS_QUERY_TYPE.INTERVIEW_ID_EXISTS, req));
        return res.status(200).send({ success: 'true', message: 'Updated Interview successfully', data: results.rows });
    } catch (e) {
        console.log('Interview Update failed: ', e);
        next(new ErrorObject(500, `Something went wrong in updateInterview!${e}`));
    }
}

export async function deleteInterview(req: Request, res: Response, next: NextFunction) {
    const { interviewId } = req.params;
    const client = await pgDb.getClient();

    try {
        // Transation:
        await client.query('BEGIN');
        // Step1: Delete Interview Sessions:
        const deleteStudentSessionResults = await pgDb.query(
            'DELETE FROM sessions WHERE interview_id=$1',
            [interviewId]);
        // Step2: Delete Interview details:
        const results = await pgDb.query(
            'DELETE FROM interviews WHERE interview_id=$1 RETURNING *',
            [interviewId]);
        // COMMIT Transaction:
        await client.query('COMMIT');

        await redisDeleteKey(getRedisKey(REDIS_QUERY_TYPE.INTERVIEW_GET, req));
        await redisDeleteKey(getRedisKey(REDIS_QUERY_TYPE.INTERVIEW_ID_EXISTS, req));

        return res.status(200).send({ success: 'true', message: 'Deleted Interview successfully', data: results.rows });
    } catch (e) {
        // ROLLBACK Transaction if failure:
        await client.query('ROLLBACK');

        console.log('Interview Deletion failed: ', e);
        next(new ErrorObject(500, `Something went wrong in deleteInterview!${e}`));
    } finally {
        client.release();
    }
}

export async function interviewIdExistInDB(req: Request, res: Response, next: NextFunction) {
    // Extract id from params, query, or body
    let interviewId = req.params.interviewId || req.query.interviewId || req.body.interviewId;

    try {
        // InterviewID exists?
        const interviewExistsResults = await pgDb.query('SELECT * FROM interviews WHERE interview_id=$1', [interviewId]);
        if (interviewExistsResults.rows.length === 0) {
            return next(new ErrorObject(400, `Interview ID ${interviewId} doesn't exist!`));
        } else {
            // Save in Cache:
            await redisSaveWithTtl(getRedisKey(REDIS_QUERY_TYPE.INTERVIEW_ID_EXISTS, req), interviewExistsResults.rows, 10);
            next();
        }
    }
    catch (e) {
        console.log('Error in finding Interview ID: ', e);
        next(new ErrorObject(500, `Something went wrong in finding Interview ID in DB!${e}`));
    }
}
