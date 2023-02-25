import { Router, Request, Response } from "express";
import { login, logout, register, user } from '../../controllers/authController';
import { forgot, reset } from '../../controllers/forgotController';
import { studentIdExistInDB, getAllStudents, getStudent, createStudent, updateStudent, deleteStudent } from '../../controllers/studentController';
import { interviewIdExistInDB, getAllInterviews, getInterview, createInterview, updateInterview, deleteInterview } from '../../controllers/InterviewController';
import { sessionExists, createSession, getSession, getSessionsOfStudent, getSessionsOfInterview, updateSessionStatus, deleteSession } from '../../controllers/sessionsController';

import checkRecaptcha from '../../middlewares/checkRecaptcha';

import { validationFactory } from "../../middlewares/validateInputs";
import { registerValidation, loginValidation, forgotValidation, resetValidation } from "../../models/validationModels";

export function configureRouter(router: Router) {
    // Auth Routes:
    router.get('/',(req:Request,res:Response)=> res.send('Welcome'));
    router.post('/api/v1/register', validationFactory(registerValidation), checkRecaptcha, register);
    router.post('/api/v1/login', validationFactory(loginValidation), checkRecaptcha, login);
    router.get('/api/v1/user',user);
    router.post('/api/v1/logout', logout);

    // Auth Forgot-Rest Password Routes:
    router.post('/api/v1/forgot', validationFactory(forgotValidation), forgot);
    router.post('/api/v1/reset', validationFactory(resetValidation), reset);

    // CRUD Student:
    router.get('/api/v1/students', getAllStudents);
    router.get('/api/v1/student/:studentId', studentIdExistInDB, getStudent);
    router.post('/api/v1/student', createStudent);
    router.put('/api/v1/student/:studentId', studentIdExistInDB, updateStudent);
    router.delete('/api/v1/student/:studentId', studentIdExistInDB, deleteStudent);

    // CRUD Interviews:
    router.get('/api/v1/interviews', getAllInterviews);
    router.get('/api/v1/interview/:interviewId', interviewIdExistInDB, getInterview);
    router.post('/api/v1/interview', createInterview);
    router.put('/api/v1/interview/:interviewId', interviewIdExistInDB, updateInterview);
    router.delete('/api/v1/interview/:interviewId', interviewIdExistInDB, deleteInterview);

    // CRUD Sessions (Student-Interview session):
    router.get('/api/v1/sessions/student/:studentId', studentIdExistInDB, getSessionsOfStudent);
    router.get('/api/v1/sessions/interview/:interviewId', interviewIdExistInDB, getSessionsOfInterview);
    router.get('/api/v1/session', studentIdExistInDB, interviewIdExistInDB, sessionExists, getSession);
    router.post('/api/v1/session', studentIdExistInDB, interviewIdExistInDB, createSession);
    router.put('/api/v1/session', studentIdExistInDB, interviewIdExistInDB, sessionExists, updateSessionStatus);
    router.delete('/api/v1/session', studentIdExistInDB, interviewIdExistInDB, sessionExists, deleteSession);
}
