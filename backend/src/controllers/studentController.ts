import { NextFunction, Request, Response } from 'express';

import pgDb from '../db/pg';
import ErrorObject from '../utils/ErrorObject';

export async function getAllStudents(req: Request, res: Response, next: NextFunction) {
    try {
        const results = await pgDb.query('SELECT * FROM students');
        return res.status(200).send({ success: 'true', message: 'Fetched student records successfully', data: results.rows });
    } catch (e) {
        console.log('getAllStudents failed: ', e);
        next(new ErrorObject(500, `Something went wrong in getAllStudents!${e}`));
    }
}

export async function getStudent(req: Request, res: Response, next: NextFunction) {
    const { studentId } = req.params;
    try {
        const results = await pgDb.query('SELECT * FROM students WHERE id=$1', [studentId]);
        // todo: append interview details of student as well.
        return res.status(200).send({ success: 'true', message: 'Successfully fetched Student details.', data: results.rows[0] });
    } catch (e) {
        console.log('getStudent failed: ', e);
        next(new ErrorObject(500, `Something went wrong in getStudent!${e}`));
    }
}

export async function createStudent(req: Request, res: Response, next: NextFunction) {
    const { first_name, last_name, batch } = req.body;

    try {
        const results = await pgDb.query('INSERT INTO students(first_name, last_name, batch) VALUES($1, $2, $3)', [first_name, last_name, batch]);
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
        const results = await pgDb.query('UPDATE students SET first_name=$1, last_name=$2, batch=$3 WHERE id=$4', [first_name, last_name, batch, studentId]);
        return res.status(200).send({ success: 'true', message: 'Updated Student successfully', data: results.rows });
    } catch (e) {
        console.log('Student Update failed: ', e);
        next(new ErrorObject(500, `Something went wrong in updateStudent!${e}`));
    }
}

export async function deleteStudent(req: Request, res: Response, next: NextFunction) {
    const { studentId } = req.params;

    try {
        const results = await pgDb.query('DELETE FROM students WHERE id=$1', [studentId]);
        return res.status(200).send({ success: 'true', message: 'Deleted Student successfully', data: results.rows });
    } catch (e) {
        console.log('Student Update failed: ', e);
        next(new ErrorObject(500, `Something went wrong in deleteStudent!${e}`));
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
        const studentExistsResults = await pgDb.query('SELECT * FROM students WHERE id=$1', [studentId]);
        if (studentExistsResults.rows.length === 0) {
            return next(new ErrorObject(400, `Student ID doesn't exist!`));
        } else {
            next();
        }
    }
    catch (e) {
        console.log('Error in finding Student ID: ', e);
        next(new ErrorObject(500, `Something went wrong in finding studentID in DB!${e}`));
    }
}
