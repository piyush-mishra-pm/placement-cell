import { NextFunction, Request, Response } from 'express';

import pgDb from '../db/pg';
import ErrorObject from '../utils/ErrorObject';
import { redisDeleteKey, redisGet, redisSaveWithTtl } from '../db/redis';
import { getRedisKey, REDIS_QUERY_TYPE } from '../db/redisHelper';

const QUERY_SELECT_ALL_STUDENTS =
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
    LEFT JOIN interviews int ON int.interview_id = ss.interview_id`;

export async function getAllStudents(req: Request, res: Response, next: NextFunction) {
    try {
        const page = parseInt(req.params.page);
        const itemsPerPage = parseInt(req.params.itemsPerPage);

        const results = await pgDb.query(
            `${QUERY_SELECT_ALL_STUDENTS}
            ORDER BY st.student_id, ss.interview_id
            LIMIT $1 OFFSET $2`,
            [itemsPerPage, (page - 1) * itemsPerPage]);

        if (results.rows.length === 0) {
            return next(new ErrorObject(400, `Students don't exist!`));
        }
        await redisSaveWithTtl(getRedisKey(REDIS_QUERY_TYPE.STUDENTS_GET, req), results.rows, 10);

        // For Pagination: Cached exists for total student result count? (Expensive query so caching used).
        const cachedTotalStudentCount = await redisGet(REDIS_QUERY_TYPE.STUDENTS_COUNT_GET);
        if (cachedTotalStudentCount) {
            return res.status(200).send({ success: 'true', message: 'Fetched student records successfully', data: results.rows, meta: { numPages: Math.ceil(cachedTotalStudentCount / itemsPerPage), count: cachedTotalStudentCount } });
        }

        // For Pagination: Cached didnt exist, so query and store result in cache? (Expensive query so caching used).
        const countResults = await pgDb.query(QUERY_SELECT_ALL_STUDENTS);

        await redisSaveWithTtl(getRedisKey(REDIS_QUERY_TYPE.STUDENTS_COUNT_GET, req), countResults.rows.length, 60);// 1minute
        return res.status(200).send({
            success: 'true',
            message: 'Fetched student records successfully',
            data: results.rows,
            meta: {
                numPages: Math.ceil(countResults.rows.length / itemsPerPage),
                count: countResults.rows.length
            }
        });

    } catch (e) {
        console.log('getAllStudents failed: ', e);
        next(new ErrorObject(500, `Something went wrong in getAllStudents!${e}`));
    }
}

export async function getStudent(req: Request, res: Response, next: NextFunction) {
    const { studentId } = req.params;
    try {
        const results = await pgDb.query('SELECT * FROM students WHERE student_id=$1', [studentId]);
        // todo: append interview details of student as well.

        if (results.rows.length === 0) {
            return next(new ErrorObject(400, `Student doesn't exist!`));
        }
        // Save in Cache:
        await redisSaveWithTtl(getRedisKey(REDIS_QUERY_TYPE.STUDENT_GET, req), results.rows, 10);
        return res.status(200).send({ success: 'true', message: 'Successfully fetched Student details.', data: results.rows[0] });
    } catch (e) {
        console.log('getStudent failed: ', e);
        next(new ErrorObject(500, `Something went wrong in getStudent!${e}`));
    }
}

export async function createStudent(req: Request, res: Response, next: NextFunction) {
    const { first_name, last_name, batch } = req.body;

    try {
        const results = await pgDb.query('INSERT INTO students(first_name, last_name, batch) VALUES($1, $2, $3) RETURNING *', [first_name, last_name, batch]);
        return res.status(200).send({ success: 'true', message: 'Created Student successfully', data: results.rows });
    } catch (e) {
        console.log('Create Student failed: ', e);
        next(new ErrorObject(500, `Something went wrong in createStudent!${e}`));
    }
}

export async function updateStudent(req: Request, res: Response, next: NextFunction) {
    const { first_name, last_name, batch } = req.body;
    const { studentId } = req.params;

    try {
        const results = await pgDb.query('UPDATE students SET first_name=$1, last_name=$2, batch=$3 WHERE student_id=$4', [first_name, last_name, batch, studentId]);
        await redisDeleteKey(getRedisKey(REDIS_QUERY_TYPE.STUDENT_GET, req));
        await redisDeleteKey(getRedisKey(REDIS_QUERY_TYPE.STUDENT_ID_EXISTS, req));
        return res.status(200).send({ success: 'true', message: 'Updated Student successfully', data: results.rows });
    } catch (e) {
        console.log('Student Update failed: ', e);
        next(new ErrorObject(500, `Something went wrong in updateStudent!${e}`));
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
            'DELETE FROM students WHERE student_id=$1 RETURNING *',
            [studentId]);
        // COMMIT Transaction:
        await client.query('COMMIT');

        await redisDeleteKey(getRedisKey(REDIS_QUERY_TYPE.STUDENT_ID_EXISTS, req));
        await redisDeleteKey(getRedisKey(REDIS_QUERY_TYPE.STUDENT_GET, req));
        return res.status(200).send({ success: 'true', message: 'Deleted Student Details and Interview-Sessions info  successfully', data: deleteStudentResults.rows });
    } catch (e) {
        // ROLLBACK Transaction if failure:
        await client.query('ROLLBACK');

        console.log('Student Deletion failed: ', e);
        next(new ErrorObject(500, `Something went wrong in deleteStudent!${e}`));
    } finally {
        client.release();
    }
}

export async function studentIdExistInDB(req: Request, res: Response, next: NextFunction) {
    // Extract id from params, query, or body
    let studentId = req.params.studentId || req.query.studentId || req.body.studentId;

    try {
        if (!studentId) {
            throw new Error("id undefined. Neither in query nor in Params");
        }
        // studentID exists?
        const studentExistsResults = await pgDb.query('SELECT * FROM students WHERE student_id=$1', [studentId]);
        if (studentExistsResults.rows.length === 0) {
            return next(new ErrorObject(400, `Student ID doesn't exist!`));
        } else {
            // Save in Cache:
            await redisSaveWithTtl(getRedisKey(REDIS_QUERY_TYPE.STUDENT_ID_EXISTS, req), studentExistsResults.rows, 10);
            next();
        }
    }
    catch (e) {
        console.log('Error in finding Student ID: ', e);
        next(new ErrorObject(500, `Something went wrong in finding studentID in DB!${e}`));
    }
}