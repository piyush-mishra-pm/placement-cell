import { STUDENT_PAYLOAD } from "./PAYLOAD_DEFINITIONS";

export function getDefaultSessionInstance(): STUDENT_PAYLOAD {
    return {
        student_id: 0,
        first_name: '',
        last_name: '',
        batch: '',
        interview_id: 0,
        company_name: '',
        interview_name: '',
        description: '',
        time: 0,
        interview_status: '',
    };
}