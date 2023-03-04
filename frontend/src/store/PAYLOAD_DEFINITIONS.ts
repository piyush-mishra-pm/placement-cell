export interface AUTH_PAYLOAD {
    userId: String | null | undefined;
    jwt: string | null | undefined;
}

export interface USER_PAYLOAD {
    first_name: string | null | undefined;
    last_name: string | null | undefined;
    email: string | null | undefined;
}

export interface STUDENT_PAYLOAD {
    student_id?: number;
    first_name?: string;
    last_name?: string;
    batch?: string;
    interview_id?:number;
    company_name?: string;
    interview_name?:string;
    description?:string;
    time?:number;
    interview_status?:string;
}

export interface INTERVIEW_PAYLOAD {
    id: number | null | undefined;
    company_name: string | null | undefined;
    interview_name: string | null | undefined;
    description: string | null | undefined;
    time: number | null | undefined;
}