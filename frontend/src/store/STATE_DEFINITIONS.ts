import { STUDENT_PAYLOAD, INTERVIEW_PAYLOAD } from "./PAYLOAD_DEFINITIONS";

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

export interface STUDENTS_STATE extends Array<STUDENT_PAYLOAD> { }
export interface INTERVIEWS_STATE extends Array<INTERVIEW_PAYLOAD> { }
export interface STATE {
    auth: AUTH_STATE;
    user: USER_STATE;
    students: STUDENTS_STATE;
    interviews: INTERVIEWS_STATE;
}