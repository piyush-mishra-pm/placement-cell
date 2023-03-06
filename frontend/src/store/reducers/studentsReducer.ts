import _ from 'lodash';

import ACTION_TYPES from '../actions/ACTION_TYPES';
import { STUDENT_PAYLOAD } from '../PAYLOAD_DEFINITIONS';
import { STUDENT_DATA, STUDENT_INTERVIEW } from '../STATE_DEFINITIONS';

const INITIAL_STUDENTS_STATE: Array<STUDENT_DATA> = [];

export default function studentsReducer(state = INITIAL_STUDENTS_STATE, { type, payload }: { type: any, payload: Array<STUDENT_PAYLOAD> }) {
  console.log('REDUCER_STUDENT:', { type, payload });
  switch (type) {
    case ACTION_TYPES.STUDENTS.GET_STUDENTS:
      return getMapKeyedAndAggregatedStudentsAll(payload);
    case ACTION_TYPES.STUDENTS.CREATE_STUDENT:
      return addStudentToKey(_.cloneDeep(state), payload[0]);
    case ACTION_TYPES.STUDENTS.DELETE_STUDENT:
      return _.cloneDeep(state).filter(st => st.student_id !== payload[0].student_id);
    case ACTION_TYPES.STUDENTS.DELETE_STUDENT_INTERVIEW:
      return deleteStudentInterview(_.cloneDeep(state), payload[0]);
    case ACTION_TYPES.AUTH.SIGN_OUT:
      return INITIAL_STUDENTS_STATE;
    case ACTION_TYPES.SESSION.CREATE_SESSION:
      return state;
    case ACTION_TYPES.SESSION.EDIT_SESSION:
      return modifySessionStatus(_.cloneDeep(state), payload[0]);
    default:
      return state;
  }
}

function getMapKeyedAndAggregatedStudentsAll(payload: Array<STUDENT_PAYLOAD>): Array<STUDENT_DATA> | null {
  let newStudentsMap = new Array<STUDENT_DATA>();

  for (const student of payload) {
    newStudentsMap = addStudentToKey(newStudentsMap, student);
  }

  return newStudentsMap;
}

function addStudentToKey(state: Array<STUDENT_DATA>, student: STUDENT_PAYLOAD): Array<STUDENT_DATA> {
  // Student ID exists:
  if (!student.student_id)
    return state;

  // Construct Interview data:
  const interviewDataArray: STUDENT_INTERVIEW = {
    interview_id: student.interview_id || undefined,
    company_name: student.company_name || undefined,
    interview_name: student.interview_name || undefined,
    description: student.description || undefined,
    time: student.time || undefined,
    interview_status: student.interview_status || undefined,
  };

  // Student ID exists as key:
  const foundStudent = state.find((st) => st.student_id === student.student_id);
  if (!foundStudent) {
    state.push({
      student_id: student.student_id,
      first_name: student.first_name,
      last_name: student.last_name,
      batch: student.batch,
      interviewData: [interviewDataArray]
    });
  }
  else {
    // pushing student's interview payload under same student id key:
    foundStudent.interviewData?.push(interviewDataArray);
  }

  return state;
}

function deleteStudentInterview(state: Array<STUDENT_DATA>, student: STUDENT_PAYLOAD): Array<STUDENT_DATA> {
  let foundStudentData = state.filter(st => st.student_id === student.student_id)[0];
  foundStudentData.interviewData = foundStudentData.interviewData?.filter(int => int.interview_id !== student.interview_id);

  if (foundStudentData.interviewData?.length === 0) {
    foundStudentData.interviewData = [{
      interview_id: undefined,
      company_name: undefined,
      interview_name: undefined,
      description: undefined,
      time: undefined,
      interview_status: undefined,
    }];
  }

  return state;
}

function modifySessionStatus(state: Array<STUDENT_DATA>, session: STUDENT_PAYLOAD): Array<STUDENT_DATA> {
  const foundStudent = state.find(st => st.student_id === session.student_id);
  if (!foundStudent) {
    console.error('Couldnt find student, cant update interview status.');
    return state;
  }

  const foundInterview = foundStudent.interviewData?.find(int => int.interview_id === session.interview_id);
  if (!foundInterview) {
    console.error('Couldnt find interview, cant update interview status.');
    return state;
  }

  foundInterview.interview_status = session.interview_status;

  return state;
}