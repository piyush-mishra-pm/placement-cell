import _ from 'lodash';

import ACTION_TYPES from '../actions/ACTION_TYPES';

const INITIAL_STUDENTS_STATE = [];

export default function userReducer(state = INITIAL_STUDENTS_STATE, {type, payload}) {
  state = _.cloneDeep(state);
  payload = _.cloneDeep(payload);

  switch (type) {
    case ACTION_TYPES.STUDENTS.GET_STUDENTS:
      return _.uniqBy(_.union(state, payload), 'id');

    default:
      return state;
  }
}
