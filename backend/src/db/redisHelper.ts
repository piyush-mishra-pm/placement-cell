import { Request, Response, NextFunction } from "express";

import { redisGet } from "./redis";
import ErrorObject from "../utils/ErrorObject";

export function getRedisKey(queryType: REDIS_QUERY_TYPE, req: Request): string {
    const studentId = req.params.studentId || req.query.studentId || req.body.studentId;
    const interviewId = req.params.interviewId || req.query.interviewId || req.body.interviewId;
    const page = req.params.page || req.query.page || req.body.page;
    const itemsPerPage = req.params.itemsPerPage || req.query.itemsPerPage || req.body.itemsPerPage;

    if (queryType === REDIS_QUERY_TYPE.STUDENT_ID_EXISTS) {
        return `ST_ID_EXISTS_${studentId}`
    }
    else if (queryType === REDIS_QUERY_TYPE.INTERVIEW_ID_EXISTS) {
        return `INT_ID_EXISTS_${interviewId}`
    }
    else if (queryType === REDIS_QUERY_TYPE.SESSION_ID_EXISTS) {
        return `SS_ID_EXISTS_${studentId}_${interviewId}`
    }
    else if (queryType === REDIS_QUERY_TYPE.SESSIONS_OF_INTERVIEW_ID) {
        return `SS_INT_EXISTS_${interviewId}_${page}_${itemsPerPage}`;
    }
    else if (queryType === REDIS_QUERY_TYPE.SESSIONS_OF_STUDENT_ID) {
        return `SS_ST_EXISTS_${studentId}_${page}_${itemsPerPage}`;
    }
    else if (queryType === REDIS_QUERY_TYPE.STUDENTS_GET) {
        return `ST_ALL_${page}_${itemsPerPage}`;
    }
    else if (queryType === REDIS_QUERY_TYPE.STUDENTS_COUNT_GET) {
        return `ST_CNT`;
    }
    else if (queryType === REDIS_QUERY_TYPE.STUDENT_GET) {
        return `ST_${studentId}`
    }
    else if (queryType === REDIS_QUERY_TYPE.INTERVIEWS_GET) {
        return `INT_ALL_${page}_${itemsPerPage}`;
    }
    else if (queryType === REDIS_QUERY_TYPE.INTERVIEWS_COUNT_GET) {
        return `INT_CNT`;
    }
    else if (queryType === REDIS_QUERY_TYPE.INTERVIEW_GET) {
        return `INT_${interviewId}`
    }
    else if (queryType === REDIS_QUERY_TYPE.SESSION_GET) {
        return `SS_${studentId}_${interviewId}`;
    }
    else if (queryType === REDIS_QUERY_TYPE.SESSIONS_AVAILABLE_FOR_STUDENT_TO_TAKE) {
        return `SS_AV_ST_${studentId}_${page}_${itemsPerPage}`;
    }
    else if (queryType === REDIS_QUERY_TYPE.STUDENTS_AVAILABLE_TO_TAKE_INTERVIEW) {
        return `SS_AV_INT_${interviewId}_${page}_${itemsPerPage}`;
    }
    else if (queryType === REDIS_QUERY_TYPE.GET_ADZUNA_JOBS_LIMIT_OFFSET) {
        return `ADZ_GET_${page}_${itemsPerPage}`;
    }
    else {
        throw new Error("Key not defined for redis.");
    }
}

export enum REDIS_QUERY_TYPE {
    STUDENT_ID_EXISTS = 'STUDENT_ID_EXISTS',
    STUDENT_GET = 'STUDENT_GET',
    STUDENTS_GET = 'STUDENTS_GET',
    STUDENTS_COUNT_GET = 'STUDENTS_COUNT_GET',

    INTERVIEW_GET = 'INTERVIEW_GET',
    INTERVIEWS_GET = 'INTERVIEWS_GET',
    INTERVIEWS_COUNT_GET = 'INTERVIEWS_COUNT_GET',
    INTERVIEW_ID_EXISTS = 'INTERVIEW_ID_EXISTS',

    SESSION_ID_EXISTS = 'SESSION_ID_EXISTS',
    SESSION_GET = 'SESSION_GET',
    SESSIONS_OF_INTERVIEW_ID = 'SESSIONS_OF_INTERVIEW_ID',
    SESSIONS_OF_STUDENT_ID = 'SESSIONS_OF_STUDENT_ID',
    SESSIONS_AVAILABLE_FOR_STUDENT_TO_TAKE = 'SESSIONS_AVAILABLE_FOR_STUDENT_TO_TAKE',
    STUDENTS_AVAILABLE_TO_TAKE_INTERVIEW = 'STUDENTS_AVAILABLE_TO_TAKE_INTERVIEW',

    GET_ADZUNA_JOBS_LIMIT_OFFSET = 'GET_ADZUNA_JOBS_LIMIT_OFFSET'
}

export function useCacheIfStored(queryType: REDIS_QUERY_TYPE, successMessage: string = 'Successfully retrieved from Cache!') {
    return async function cacheData(req: Request, res: Response, next: NextFunction) {
        const cacheKey = getRedisKey(queryType, req);
        try {
            const cacheResults = await redisGet(cacheKey);
            if (cacheResults) {
                let results = JSON.parse(cacheResults);

                res.send({
                    message: successMessage,
                    success: 'true',
                    fromCache: true,
                    data: results,
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