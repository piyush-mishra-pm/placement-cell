export interface AUTH_PAYLOAD {
    userId: String | null | undefined;
    jwt: string | null | undefined;
}

export interface USER_PAYLOAD {
    first_name: string | null | undefined;
    last_name: string | null | undefined;
    email: string | null | undefined;
}

export interface STUDENT_PAYLOAD extends STUDENT_PII_PAYLOAD {
    interview_id?:number;
    company_name?: string;
    interview_name?:string;
    description?:string;
    time?:number;
    interview_status?:string;
}

export interface STUDENT_PII_PAYLOAD {
    student_id?: number;
    first_name?: string;
    last_name?: string;
    batch?: string;
}

export interface INTERVIEW_PAYLOAD {
    interview_id?: number;
    company_name?: string;
    interview_name?: string;
    description?: string;
    time?: number;
}