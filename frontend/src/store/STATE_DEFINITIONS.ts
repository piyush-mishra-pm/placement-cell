import { INTERVIEW_PAYLOAD, STUDENT_PII_PAYLOAD } from "./PAYLOAD_DEFINITIONS";

export interface AUTH_STATE {
    isSignedIn: boolean | null | undefined;
    userId: String | null | undefined;
    jwt: string | null | undefined;
}

export interface USER_STATE {
    first_name: string | null | undefined;
    last_name: string | null | undefined;
    email: string | null | undefined;
}

export interface STUDENTS_STATE extends Array<STUDENT_DATA> { }

export interface STUDENT_DATA{
    student_id?: number;
    first_name?: string;
    last_name?: string;
    batch?: string;
    interviewData?: Array<STUDENT_INTERVIEW>;
}

export interface INTERVIEW_DATA extends INTERVIEW_PAYLOAD {
    studentData?: Array<INTERVIEW_STUDENT>;
}

export interface INTERVIEW_STUDENT extends STUDENT_PII_PAYLOAD {
    interview_status?: string;
}

export interface STUDENT_INTERVIEW extends INTERVIEW_PAYLOAD {
    interview_status?: string;// todo: change to INTERVIEW_STATE
}

export interface INTERVIEWS_STATE extends Array<INTERVIEW_DATA> { }
export interface STATE {
    auth: AUTH_STATE;
    user: USER_STATE;
    students: STUDENTS_STATE;
    interviews: INTERVIEWS_STATE;
}

export enum INTERVIEW_STATUS {
    ON_HOLD = 'ON-HOLD',
    NO_ATTEMPT = 'NOT-ATTEMPTED',
    CLEARED = 'CLEARED',
    FAILED = 'FAILED',
    DISQUALIFIED = 'DISQUALIFIED',
}

export type INTERVIEW_STATUS_VALUES = keyof typeof INTERVIEW_STATUS;