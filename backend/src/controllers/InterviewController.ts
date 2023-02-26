import { NextFunction, Request, Response } from 'express';

import pgDb from '../db/pg';
import ErrorObject from '../utils/ErrorObject';
import { redisSaveWithTtl } from '../db/redis';
import { getRedisKey, REDIS_QUERY_TYPE } from '../db/redisHelper';

export async function getAllInterviews(req: Request, res: Response, next: NextFunction) {
    const page = parseInt(req.params.page);
    const itemsPerPage = parseInt(req.params.itemsPerPage);

    try {
        const results = await pgDb.query(
            'SELECT * FROM interviews LIMIT $1 OFFSET $2',
            [itemsPerPage, (page - 1) * itemsPerPage]);
        if (results.rows.length === 0) {
            return next(new ErrorObject(400, 'No Interviews results!'));
        }
        await redisSaveWithTtl(getRedisKey(REDIS_QUERY_TYPE.INTERVIEWS_GET, req), results.rows, 10);
        return res.status(200).send({ success: 'true', message: 'Fetched Interview records successfully', data: results.rows });
    } catch (e) {
        console.log('getAllInterviews failed: ', e);
        next(new ErrorObject(500, `Something went wrong in getAllInterviews!${e}`));
    }
}

export async function getInterview(req: Request, res: Response, next: NextFunction) {
    const { interviewId } = req.params;
    try {
        const results = await pgDb.query('SELECT * FROM interviews WHERE id=$1', [interviewId]);
        // todo: append interview details of Interview as well.
        if (results.rows.length === 0) {
            return next(new ErrorObject(400, 'No such interview found'));
        }
        // Save in Cache:
        await redisSaveWithTtl(getRedisKey(REDIS_QUERY_TYPE.INTERVIEW_GET, req), results.rows, 10);
        return res.status(200).send({ success: 'true', message: 'Successfully fetched Interview details.', data: results.rows[0] });
    } catch (e) {
        console.log('getInterview failed: ', e);
        next(new ErrorObject(500, `Something went wrong in getInterview!${e}`));
    }
}

export async function createInterview(req: Request, res: Response, next: NextFunction) {
    const { company_name, interview_name, description, time } = req.body;

    try {
        const results = await pgDb.query('INSERT INTO interviews(company_name, interview_name, description, time) VALUES($1, $2, $3, $4)', [company_name, interview_name, description, time]);
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
        const results = await pgDb.query('UPDATE interviews SET company_name=$1, interview_name=$2, description=$3, time=$4 WHERE id=$5', [company_name, interview_name, description, time, interviewId]);
        return res.status(200).send({ success: 'true', message: 'Updated Interview successfully', data: results.rows });
    } catch (e) {
        console.log('Interview Update failed: ', e);
        next(new ErrorObject(500, `Something went wrong in updateInterview!${e}`));
    }
}

export async function deleteStudent(req: Request, res: Response, next: NextFunction) {
    const { studentId } = req.params;
    const client = await pgDb.getClient();

    try {
        // Transation:
        await client.query('BEGIN');
        // Step1: Delete Interview Sessions of Student:
        const deleteStudentSessionResults = await pgDb.query(
            'DELETE FROM sessions WHERE student_id=$1',
            [studentId]);

        // Step2: Delete Student details:
        const deleteStudentResults = await pgDb.query(
            'DELETE FROM students WHERE id=$1',
            [studentId]);
        // COMMIT Transaction:
        await client.query('COMMIT');
        return res.status(200).send({ success: 'true', message: 'Deleted Student Details and Interview-Sessions info  successfully', data: deleteStudentResults.rows });
    } catch (e) {
        console.log('Student Deletion failed: ', e);
        // ROLLBACK Transaction if failure:
        await client.query('ROLLBACK');
        next(new ErrorObject(500, `Something went wrong in deleteStudent!${e}`));
    } finally {
        client.release();
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
            'DELETE FROM interviews WHERE id=$1',
            [interviewId]);
        // COMMIT Transaction:
        await client.query('COMMIT');

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
        const interviewExistsResults = await pgDb.query('SELECT * FROM interviews WHERE id=$1', [interviewId]);
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
