import _ from 'lodash';

import ACTION_TYPES from '../actions/ACTION_TYPES';
import { STUDENT_PAYLOAD } from '../PAYLOAD_DEFINITIONS';
import { STUDENTS_STATE, STUDENT_DATA, STUDENT_INTERVIEW } from '../STATE_DEFINITIONS';

const INITIAL_STUDENTS_STATE: Array<STUDENT_DATA> = [];

export default function studentsReducer(state = INITIAL_STUDENTS_STATE, { type, payload }: { type: any, payload: Array<STUDENT_PAYLOAD> }) {
  console.log(payload, type);
  switch (type) {
    case ACTION_TYPES.STUDENTS.GET_STUDENTS:
      return getMapKeyedAndAggregatedStudentsAll(payload);
    case ACTION_TYPES.STUDENTS.CREATE_STUDENT:
      return _.cloneDeep(concatStudent(state, payload[0]));
    case ACTION_TYPES.STUDENTS.DELETE_STUDENT:
      return _.reject(_.cloneDeep(state), { id: payload[0].student_id });
    case ACTION_TYPES.AUTH.SIGN_OUT:
      return INITIAL_STUDENTS_STATE;
    default:
      return state;
  }
}

function getMapKeyedAndAggregatedStudentsAll(payload: Array<STUDENT_PAYLOAD>): Array<STUDENT_DATA> | null {
  let newStudentsMap = new Array<STUDENT_DATA>();

  for (const student of payload) {
    newStudentsMap = addStudentToKey(newStudentsMap, student);
  }
  console.log(newStudentsMap);
  return newStudentsMap;
}

function concatStudent(state: Array<STUDENT_DATA>, payload: STUDENT_PAYLOAD): Array<STUDENT_DATA> {
  state = _.cloneDeep(state);
  state = addStudentToKey(state, payload);
  return state;
}

function addStudentToKey(newStudentsMap: Array<STUDENT_DATA>, student: STUDENT_PAYLOAD): Array<STUDENT_DATA> {
  console.log(student, newStudentsMap);
  // Student ID exists:
  if (!student.student_id)
    return newStudentsMap;

  // Construct Interview data:
  const interviewDataArray: STUDENT_INTERVIEW = {
    interview_id: student.interview_id,
    company_name: student.company_name,
    interview_name: student.interview_name,
    description: student.description,
    time: student.time,
    interview_status: student.interview_status,
  };

  // Student ID exists as key:
  let foundStudent = newStudentsMap.find(st => st.student_id === student.student_id);
  if (!foundStudent) {
    newStudentsMap.push({
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

  return newStudentsMap;
}