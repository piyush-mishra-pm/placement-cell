import _ from 'lodash';

import ACTION_TYPES from '../actions/ACTION_TYPES';
import { INTERVIEW_STUDENT_PAYLOAD } from '../PAYLOAD_DEFINITIONS';
import { INTERVIEW_STUDENT, INTERVIEW_DATA } from '../STATE_DEFINITIONS';

const INITIAL_INTERVIEWS_STATE: Array<INTERVIEW_DATA> = [];

export default function interviewsReducer(state = INITIAL_INTERVIEWS_STATE, { type, payload }:
  { type: any, payload: Array<INTERVIEW_STUDENT_PAYLOAD> }) {

  console.log('REDUCER_INTERVIEW:', { type, payload });
  switch (type) {
    case ACTION_TYPES.INTERVIEWS.GET_INTERVIEWS:
      return getMapKeyedAndAggregatedInterviewsAll(payload);
    case ACTION_TYPES.AUTH.SIGN_OUT:
      return INITIAL_INTERVIEWS_STATE;
    case ACTION_TYPES.SESSION.DELETE_SESSION:
      console.error('Implement logic here in INTERVIEW-REDUCER');
      return deleteSession(_.cloneDeep(state), payload[0]);
    case ACTION_TYPES.INTERVIEWS.CREATE_INTERVIEW:
      return addInterviewToKey(_.cloneDeep(state), payload[0]);
    case ACTION_TYPES.INTERVIEWS.DELETE_INTERVIEW:
      return _.cloneDeep(state).filter(int => int.interview_id !== payload[0].interview_id);
    case ACTION_TYPES.SESSION.EDIT_SESSION:
      return modifySessionStatus(_.cloneDeep(state), payload[0]);
    default:
      return state;
  }
}

function getMapKeyedAndAggregatedInterviewsAll(payload: Array<INTERVIEW_STUDENT_PAYLOAD>): Array<INTERVIEW_DATA> | null {
  let newInterviewsMap = new Array<INTERVIEW_DATA>();

  for (const interview of payload) {
    newInterviewsMap = addInterviewToKey(newInterviewsMap, interview);
  }

  return newInterviewsMap;
}

function addInterviewToKey(state: Array<INTERVIEW_DATA>, interview: INTERVIEW_STUDENT_PAYLOAD): Array<INTERVIEW_DATA> {
  // Student ID exists:
  if (!interview.interview_id)
    return state;

  // Construct Interview data:
  const studentEntry: INTERVIEW_STUDENT = {
    student_id: interview.student_id || undefined,
    first_name: interview.first_name || undefined,
    last_name: interview.last_name || undefined,
    batch: interview.batch || undefined,
    interview_status: interview.interview_status || undefined,
  };

  // Student ID exists as key:
  const foundStudent = state.find((st) => st.interview_id === interview.interview_id);
  if (!foundStudent) {
    state.push({
      interview_id: interview.interview_id,
      company_name: interview.company_name,
      interview_name: interview.interview_name,
      description: interview.description,
      time: interview.time,
      studentData: [studentEntry]
    });
  }
  else {
    // pushing student's interview payload under same student id key:
    foundStudent.studentData?.push(studentEntry);
  }

  return state;
}

function deleteSession(state: Array<INTERVIEW_DATA>, interview: INTERVIEW_STUDENT_PAYLOAD): Array<INTERVIEW_DATA> {
  let foundInterviewData = state.filter(st => st.interview_id === interview.interview_id)[0];
  foundInterviewData.studentData = foundInterviewData.studentData?.filter(int => int.student_id !== interview.student_id);

  if (foundInterviewData.studentData?.length === 0) {
    foundInterviewData.studentData = [{
      student_id: undefined,
      first_name: undefined,
      last_name: undefined,
      batch: undefined,
      interview_status: undefined,
    }];
  }

  return state;
}

function modifySessionStatus(state: Array<INTERVIEW_DATA>, session: INTERVIEW_STUDENT_PAYLOAD): Array<INTERVIEW_DATA> {
  const foundInterview = state.find(st => st.interview_id === session.interview_id);
  if (!foundInterview) {
    console.error('Couldnt find interview, cant update session status.');
    return state;
  }

  const foundStudent = foundInterview.studentData?.find(st => st.student_id === session.student_id);
  if (!foundStudent) {
    console.error('Couldnt find student, cant update session status.');
    return state;
  }

  foundStudent.interview_status = session.interview_status;

  return state;
}