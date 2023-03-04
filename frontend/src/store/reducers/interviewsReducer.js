import _ from 'lodash';

import ACTION_TYPES from '../actions/ACTION_TYPES';

const INITIAL_INTERVIEWS_STATE = [];

export default function interviewsReducer(state = INITIAL_INTERVIEWS_STATE, {type, payload}) {
  switch (type) {
    case ACTION_TYPES.INTERVIEWS.GET_INTERVIEWS:
      return _.uniqBy(_.union(state, payload), 'id');
    case ACTION_TYPES.AUTH.SIGN_OUT:
      return INITIAL_INTERVIEWS_STATE;
    default:
      return state;
  }
}
