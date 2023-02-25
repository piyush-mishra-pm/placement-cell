import { NextFunction, Request, Response } from 'express';

import pgDb from '../db/pg';
import ErrorObject from '../utils/ErrorObject';

export async function createSession(req: Request, res: Response, next: NextFunction) {
    const { studentId, interviewId, interviewStatus } = req.body;
    try {
        const results = await pgDb.query(
            `INSERT INTO sessions(student_id, interview_id, interview_status)
                SELECT $1, $2, $3
            WHERE
                NOT EXISTS(
                    SELECT student_id, interview_id FROM sessions WHERE student_id = $1 and interview_id = $2
                )`,
            [studentId, interviewId, interviewStatus]);
        return res.status(200).send({ success: 'true', message: 'Created Session successfully', data: results.rows });
    } catch (e) {
        console.log('Session Creation failed: ', e);
        next(new ErrorObject(500, `Something went wrong in Session Creation!${e}`));
    }
}

export async function getSession(req: Request, res: Response, next: NextFunction) {
    const { studentId, interviewId } = req.body;

    try {
        const results = await pgDb.query(
            `SELECT 
                st.id as student_id, 
                first_name, last_name, 
                batch, 
                ss.interview_id, 
                company_name, 
                interview_name, 
                description, 
                time, 
                interview_status 
            FROM students AS st 
            LEFT JOIN sessions ss ON ss.student_id = st.id 
            LEFT JOIN interviews int ON int.id = ss.interview_id
            WHERE student_id=$1 AND interview_id=$2`,
            [studentId, interviewId]);
        return res.status(200).send({ success: 'true', message: 'Fetched Session successfully', data: results.rows });
    } catch (e) {
        console.log('Fetching Session failed: ', e);
        next(new ErrorObject(500, `Something went wrong in fetchingSession!${e}`));
    }
}

export async function getSessionsOfStudent(req: Request, res: Response, next: NextFunction) {
    const { studentId } = req.params;

    try {
        const results = await pgDb.query(
            `SELECT 
                st.id as student_id, 
                first_name, last_name, 
                batch, 
                ss.interview_id, 
                company_name, 
                interview_name, 
                description, 
                time, 
                interview_status 
            FROM students AS st 
            LEFT JOIN sessions ss ON ss.student_id = st.id 
            LEFT JOIN interviews int ON int.id = ss.interview_id
            WHERE student_id=$1`,
            [studentId]);
        return res.status(200).send({ success: 'true', message: 'Fetched Sessions of student successfully', data: results.rows });
    } catch (e) {
        console.log('Fetching Student Session failed: ', e);
        next(new ErrorObject(500, `Something went wrong in getSessionsOfStudent!${e}`));
    }
}

export async function getSessionsOfInterview(req: Request, res: Response, next: NextFunction) {
    const { interviewId } = req.params;

    try {
        const results = await pgDb.query(
            `SELECT 
                st.id as student_id, 
                first_name, last_name, 
                batch, 
                ss.interview_id, 
                company_name, 
                interview_name, 
                description, 
                time, 
                interview_status 
            FROM interviews AS int 
            LEFT JOIN sessions ss ON int.id = ss.interview_id
            LEFT JOIN students st ON ss.student_id = st.id 
            WHERE interview_id=$1`,
            [interviewId]);
        return res.status(200).send({ success: 'true', message: 'Fetched Sessions of interview successfully', data: results.rows });
    } catch (e) {
        console.log('Fetching Sessions of interview failed: ', e);
        next(new ErrorObject(500, `Something went wrong in getSessionsOfInterview!${e}`));
    }
}

export async function updateSessionStatus(req: Request, res: Response, next: NextFunction) {
    const { studentId, interviewId, interviewStatus } = req.body;

    try {
        const results = await pgDb.query(
            'UPDATE sessions SET interview_status=$3 WHERE student_id=$1 AND interview_id=$2',
            [studentId, interviewId, interviewStatus]);
        return res.status(200).send({ success: 'true', message: 'Updated session status successfully', data: results.rows });
    } catch (e) {
        console.log('Updating Session status failed: ', e);
        next(new ErrorObject(500, `Something went wrong in updateSessionStatus!${e}`));
    }
}

export async function deleteSession(req: Request, res: Response, next: NextFunction) {
    const { studentId, interviewId } = req.body;

    // todo: add transaction for deleting session.
    try {
        const results = await pgDb.query(
            'DELETE FROM sessions WHERE student_id=$1 AND interview_id=$2',
            [studentId, interviewId]);
        return res.status(200).send({ success: 'true', message: 'Delete session status successfully', data: results.rows });
    } catch (e) {
        console.log('Deleting Session failed: ', e);
        next(new ErrorObject(500, `Something went wrong in deleteSession!${e}`));
    }
}

export async function sessionExists(req: Request, res: Response, next: NextFunction) {
    const { studentId, interviewId } = req.body;
    try {
        if (!studentId || !interviewId) {
            throw new Error("ID of Student or Interview is missing in body.");
        }
        // studentID exists?
        const sessionExistsResults = await pgDb.query('SELECT * FROM sessions WHERE student_id=$1 AND interview_id=$2', [studentId, interviewId]);
        if (sessionExistsResults.rows.length === 0) {
            return next(new ErrorObject(400, `Such session doesn't exist!`));
        } else {
            next();
        }
    }
    catch (e) {
        console.log('Error in finding Session: ', e);
        next(new ErrorObject(500, `Something went wrong in finding session in DB!${e}`));
    }
}