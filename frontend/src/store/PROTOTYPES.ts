import { EXTERNAL_JOB_PAYLOAD_ITEM, STUDENT_PAYLOAD } from "./PAYLOAD_DEFINITIONS";

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

export function getDefaultExternalJobsInstance(): EXTERNAL_JOB_PAYLOAD_ITEM {
    return {
        redirect_url: undefined,
        description: undefined,
        title: undefined,
        company: undefined,
        location: undefined,
        created: undefined,
        contract_time: undefined,
        contract_type: undefined,
    };
}