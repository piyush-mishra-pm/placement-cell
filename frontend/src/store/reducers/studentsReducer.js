import _ from 'lodash';

import ACTION_TYPES from '../actions/ACTION_TYPES';

const INITIAL_STUDENTS_STATE = [];

export default function studentsReducer(state = INITIAL_STUDENTS_STATE, {type, payload}) {
  switch (type) {
    case ACTION_TYPES.STUDENTS.GET_STUDENTS:
      return _.uniqBy(_.union(state, payload), 'id');
    case ACTION_TYPES.STUDENTS.CREATE_STUDENT:
      return _.cloneDeep(state.concat(payload[0]));
    case ACTION_TYPES.STUDENTS.DELETE_STUDENT:
      return _.reject(_.cloneDeep(state), {id: payload[0].id});
    case ACTION_TYPES.AUTH.SIGN_OUT:
      return INITIAL_STUDENTS_STATE;
    default:
      return state;
  }
}
