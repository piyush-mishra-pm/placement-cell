import { NextFunction, Request, Response } from 'express';

import pgDb from '../db/pg';
import ErrorObject from '../utils/ErrorObject';
import { redisSaveWithTtl, redisDeleteKey, redisGet } from '../db/redis';
import { getRedisKey, REDIS_QUERY_TYPE } from '../db/redisHelper';

export async function createSession(req: Request, res: Response, next: NextFunction) {
    const studentId = req.params.studentId || req.query.studentId || req.body.studentId;
    const interviewId = req.params.interviewId || req.query.interviewId || req.body.interviewId;
    const interviewStatus = req.params.interviewStatus || req.query.interviewStatus || req.body.interviewStatus;

    try {
        if (!studentId || !interviewId || !interviewStatus) {
            throw new Error("studentId, or interviewId, or interviewStatus is undefined/null. Cant create session.");
        }
        const results = await pgDb.query(
            `INSERT INTO sessions(student_id, interview_id, interview_status)
                SELECT $1, $2, $3
            WHERE
                NOT EXISTS(
                    SELECT student_id, interview_id FROM sessions WHERE student_id = $1 and interview_id = $2
                )`,
            [studentId, interviewId, interviewStatus]);
        await redisDeleteKey(getRedisKey(REDIS_QUERY_TYPE.STUDENTS_AVAILABLE_TO_TAKE_INTERVIEW, req));
        return res.status(200).send({ success: 'true', message: 'Created Session successfully', data: results.rows });
    } catch (e) {
        console.log('Session Creation failed: ', e);
        next(new ErrorObject(500, `Something went wrong in Session Creation!${e}`));
    }
}

export async function getSession(req: Request, res: Response, next: NextFunction) {
    const studentId = req.params.studentId || req.query.studentId || req.body.studentId;
    const interviewId = req.params.interviewId || req.query.interviewId || req.body.interviewId;

    try {
        if (!studentId || !interviewId) {
            throw new Error("studentId, or interviewId is undefined/null. Cant get session.");
        }
        const results = await pgDb.query(
            `SELECT 
                st.student_id as student_id, 
                first_name, last_name, 
                batch, 
                ss.interview_id, 
                company_name, 
                interview_name, 
                description, 
                time, 
                interview_status 
            FROM students AS st 
            LEFT JOIN sessions ss ON ss.student_id = st.student_id
            LEFT JOIN interviews int ON int.interview_id = ss.interview_id
            WHERE ss.student_id=$1 AND ss.interview_id=$2`,
            [studentId, interviewId]);
        if (results.rows.length === 0) {
            return next(new ErrorObject(400, 'No such interview session exists.'));
        }
        await redisSaveWithTtl(getRedisKey(REDIS_QUERY_TYPE.SESSION_GET, req), results.rows, 10);
        return res.status(200).send({ success: 'true', message: 'Fetched Session successfully', data: results.rows });
    } catch (e) {
        console.log('Fetching Session failed: ', e);
        next(new ErrorObject(500, `Something went wrong in fetchingSession!${e}`));
    }
}

export async function getSessionsOfStudent(req: Request, res: Response, next: NextFunction) {
    const studentId = req.params.studentId || req.query.studentId || req.body.studentId;
    const page = parseInt(req.params.page);
    const itemsPerPage = parseInt(req.params.itemsPerPage);
    try {
        if (!studentId || !page || !itemsPerPage || isNaN(page) || isNaN(itemsPerPage)) {
            throw new Error("studentId, page or itemsPerPage is undefined/null. Cant get sessions of student.");
        }

        const results = await pgDb.query(
            `SELECT 
                st.student_id as student_id, 
                first_name, last_name, 
                batch, 
                ss.interview_id, 
                company_name, 
                interview_name, 
                description, 
                time, 
                interview_status 
            FROM students AS st 
            LEFT JOIN sessions ss ON ss.student_id = st.student_id 
            LEFT JOIN interviews int ON int.interview_id = ss.interview_id
            WHERE ss.student_id=$1
            ORDER BY st.student_id,ss.interview_id
            LIMIT $2 OFFSET $3`,
            [studentId, itemsPerPage, (page - 1) * itemsPerPage]);
        if (results.rows.length === 0) {
            return next(new ErrorObject(400, 'No such interview sessions of the student.'));
        }
        // Save in Cache:
        //await redisSaveWithTtl(getRedisKey(REDIS_QUERY_TYPE.SESSIONS_OF_STUDENT_ID, req), results.rows, 10);

        // For Pagination:
        const countResults = await pgDb.query(
            `SELECT COUNT(*)
            FROM students AS st 
            LEFT JOIN sessions ss ON ss.student_id = st.student_id 
            LEFT JOIN interviews int ON int.interview_id = ss.interview_id
            WHERE ss.student_id=$1`,
            [studentId]);

        return res.status(200).send({
            success: 'true',
            message: 'Fetched Sessions of student successfully',
            data: results.rows,
            meta: {
                numPages: Math.ceil(countResults.rows[0].count / itemsPerPage),
                count: countResults.rows[0].count
            }
        });

    } catch (e) {
        console.log('Fetching Student Session failed: ', e);
        next(new ErrorObject(500, `Something went wrong in getSessionsOfStudent!${e}`));
    }
}

export async function getSessionsAvailabaleForStudentToTake(req: Request, res: Response, next: NextFunction) {
    const studentId = req.params.studentId || req.query.studentId || req.body.studentId;
    const page = parseInt(req.params.page);
    const itemsPerPage = parseInt(req.params.itemsPerPage);
    try {
        if (!studentId || !page || !itemsPerPage || isNaN(page) || isNaN(itemsPerPage)) {
            throw new Error(`studentId, page or itemsPerPage is undefined/null. Cant get sessions available for student to take.`);
        }

        const results = await pgDb.query(
            `SELECT * 
            FROM interviews AS int
            WHERE interview_id 
                NOT IN (
                    SELECT DISTINCT interview_id 
                    FROM sessions AS ss
                    WHERE student_id=$1
                )
            ORDER BY int.interview_id
            LIMIT $2 OFFSET $3;`,
            [studentId, itemsPerPage, (page - 1) * itemsPerPage]);
        if (results.rows.length === 0) {
            return next(new ErrorObject(400, 'No available sessions for the student.'));
        }
        // Save in Cache:
        //await redisSaveWithTtl(getRedisKey(REDIS_QUERY_TYPE.SESSIONS_AVAILABLE_FOR_STUDENT_TO_TAKE, req), results.rows, 10);

        // For Pagination:
        const countResults = await pgDb.query(
            `SELECT COUNT(*)
            FROM interviews 
            WHERE interview_id 
                NOT IN (
                    SELECT DISTINCT interview_id 
                    FROM sessions 
                    WHERE student_id=$1
                )`,
            [studentId]);


        console.log('👍', { numPage: countResults.rows[0] / itemsPerPage, itemsPerPage, result: results.rows[0], countResults: countResults.rows[0].count });

        return res.status(200).send({
            success: 'true',
            message: 'Successfully fetched Available Sessions for student to take.',
            data: results.rows,
            meta: {
                numPages: Math.ceil(countResults.rows[0].count / itemsPerPage),
                count: countResults.rows[0].count
            }
        });
    } catch (e) {
        console.log('Fetching Student Avaiblable Session to take, failed: ', e);
        next(new ErrorObject(500, `Something went wrong in getSessionsAvailabaleForStudentToTake!${e}`));
    }
}

export async function getSessionsOfInterview(req: Request, res: Response, next: NextFunction) {
    const interviewId = req.params.interviewId || req.query.interviewId || req.body.interviewId;
    const page = parseInt(req.params.page);
    const itemsPerPage = parseInt(req.params.itemsPerPage);

    try {
        if (!interviewId || !page || !itemsPerPage || isNaN(page) || isNaN(itemsPerPage)) {
            throw new Error("interviewId, page or itemsPerPage is undefined/null. Cant get sessions of interview.");
        }

        const results = await pgDb.query(
            `SELECT 
                st.student_id as student_id, 
                first_name, last_name, 
                batch, 
                ss.interview_id, 
                company_name, 
                interview_name, 
                description, 
                time, 
                interview_status 
            FROM interviews AS int 
            LEFT JOIN sessions ss ON int.interview_id = ss.interview_id
            LEFT JOIN students st ON ss.student_id = st.student_id 
            WHERE ss.interview_id=$1
            ORDER BY int.interview_id, ss.student_id
            LIMIT $2 OFFSET $3`,
            [interviewId, itemsPerPage, (page - 1) * itemsPerPage]);
        if (results.rows.length === 0) {
            return next(new ErrorObject(400, 'No such interview sessions of the Interview.'));
        }
        // Save in Cache:
        //await redisSaveWithTtl(getRedisKey(REDIS_QUERY_TYPE.SESSIONS_OF_INTERVIEW_ID, req), results.rows, 10);

        // For Pagination:
        const countResults = await pgDb.query(
            `SELECT COUNT(*) 
            FROM interviews AS int 
            LEFT JOIN sessions ss ON int.interview_id = ss.interview_id
            LEFT JOIN students st ON ss.student_id = st.student_id 
            WHERE ss.interview_id=$1`,
            [interviewId]);

        return res.status(200).send({
            success: 'true',
            message: 'Fetched Sessions of interview successfully',
            data: results.rows,
            meta: {
                numPages: Math.ceil(countResults.rows[0].count / itemsPerPage),
                count: countResults.rows[0].count
            }
        });

    } catch (e) {
        console.log('Fetching Sessions of interview failed: ', e);
        next(new ErrorObject(500, `Something went wrong in getSessionsOfInterview!${e}`));
    }
}

export async function getStudentsAvailableForInterviewSession(req: Request, res: Response, next: NextFunction) {
    const interviewId = req.params.interviewId || req.query.interviewId || req.body.interviewId;
    const page = parseInt(req.params.page);
    const itemsPerPage = parseInt(req.params.itemsPerPage);

    try {
        if (!interviewId || !page || !itemsPerPage || isNaN(page) || isNaN(itemsPerPage)) {
            throw new Error("interviewId, page or itemsPerPage is undefined/null. Cant get sessions of interview.");
        }

        const results = await pgDb.query(
            `SELECT *
            FROM students AS st
            WHERE student_id
                NOT IN (SELECT DISTINCT student_id
                        FROM sessions
                        WHERE interview_id=$1)
            ORDER BY st.student_id
            LIMIT $2 OFFSET $3`,
            [interviewId, itemsPerPage, (page - 1) * itemsPerPage]);
        if (results.rows.length === 0) {
            return next(new ErrorObject(400, 'No such interview sessions of the Interview.'));
        }
        // Save in Cache:
        //await redisSaveWithTtl(getRedisKey(REDIS_QUERY_TYPE.STUDENTS_AVAILABLE_TO_TAKE_INTERVIEW, req), results.rows, 10);

        // For Pagination:
        const countResults = await pgDb.query(
            `SELECT COUNT(*) 
            FROM students
            WHERE student_id
                NOT IN (SELECT DISTINCT student_id
                        FROM sessions
                        WHERE interview_id=$1)
                `,
            [interviewId]);

        return res.status(200).send({
            success: 'true',
            message: 'Fetched Sessions of interview successfully',
            data: results.rows,
            meta: {
                numPages: Math.ceil(countResults.rows[0].count / itemsPerPage),
                count: countResults.rows[0].count
            }
        });
    } catch (e) {
        console.log('Fetching Sessions of interview failed: ', e);
        next(new ErrorObject(500, `Something went wrong in getSessionsOfInterview!${e}`));
    }
}

export async function updateSessionStatus(req: Request, res: Response, next: NextFunction) {
    const studentId = req.params.studentId || req.query.studentId || req.body.studentId;
    const interviewId = req.params.interviewId || req.query.interviewId || req.body.interviewId;
    const interviewStatus = req.params.interviewStatus || req.query.interviewStatus || req.body.interviewStatus;

    try {
        if (!studentId || !interviewId || !interviewStatus) {
            throw new Error("studentId, or interviewId, or interviewStatus is undefined/null. Cant update session status.");
        }
        const results = await pgDb.query(
            'UPDATE sessions SET interview_status=$3 WHERE student_id=$1 AND interview_id=$2',
            [studentId, interviewId, interviewStatus]);
        await redisDeleteKey(getRedisKey(REDIS_QUERY_TYPE.SESSIONS_OF_STUDENT_ID, req));
        await redisDeleteKey(getRedisKey(REDIS_QUERY_TYPE.SESSIONS_OF_INTERVIEW_ID, req));
        await redisDeleteKey(getRedisKey(REDIS_QUERY_TYPE.SESSION_GET, req));
        await redisDeleteKey(getRedisKey(REDIS_QUERY_TYPE.STUDENTS_GET, req));
        return res.status(200).send({ success: 'true', message: 'Updated session status successfully', data: results.rows });
    } catch (e) {
        console.log('Updating Session status failed: ', e);
        next(new ErrorObject(500, `Something went wrong in updateSessionStatus!${e}`));
    }
}

export async function deleteSession(req: Request, res: Response, next: NextFunction) {
    const studentId = req.params.studentId || req.query.studentId || req.body.studentId;
    const interviewId = req.params.interviewId || req.query.interviewId || req.body.interviewId;

    // todo: add transaction for deleting session.
    try {
        if (!studentId || !interviewId) {
            throw new Error("studentId, or interviewId is undefined/null. Cant delete session status.");
        }
        const results = await pgDb.query(
            'DELETE FROM sessions WHERE student_id=$1 AND interview_id=$2',
            [studentId, interviewId]);
        await redisDeleteKey(getRedisKey(REDIS_QUERY_TYPE.SESSIONS_OF_STUDENT_ID, req));
        await redisDeleteKey(getRedisKey(REDIS_QUERY_TYPE.SESSIONS_OF_INTERVIEW_ID, req));
        await redisDeleteKey(getRedisKey(REDIS_QUERY_TYPE.SESSION_GET, req));
        return res.status(200).send({ success: 'true', message: 'Delete session status successfully', data: results.rows });
    } catch (e) {
        console.log('Deleting Session failed: ', e);
        next(new ErrorObject(500, `Something went wrong in deleteSession!${e}`));
    }
}

export function sessionExists(allowExistence: boolean) {

    return async (req: Request, res: Response, next: NextFunction) => {
        const studentId = req.params.studentId || req.query.studentId || req.body.studentId;
        const interviewId = req.params.interviewId || req.query.interviewId || req.body.interviewId;

        try {
            if (!studentId || !interviewId) {
                throw new Error("ID of Student or Interview is missing in body.");
            }
            // studentID exists?
            const sessionExistsResults = await pgDb.query('SELECT * FROM sessions WHERE student_id=$1 AND interview_id=$2', [studentId, interviewId]);
            if (allowExistence) {
                if (sessionExistsResults.rows.length === 0) {
                    return next(new ErrorObject(400, `Such session doesn't exist!`));
                } else {
                    await redisSaveWithTtl(getRedisKey(REDIS_QUERY_TYPE.SESSION_ID_EXISTS, req), sessionExistsResults.rows, 10);
                    next();
                }
            } else {
                if (sessionExistsResults.rows.length === 0) {
                    next();
                } else {
                    return next(new ErrorObject(400, `Such session already exist, can't recreate it!`));
                }
            }

        }
        catch (e) {
            console.log('Error in finding Session: ', e);
            next(new ErrorObject(500, `Something went wrong in finding session in DB!${e}`));
        }
    }
}