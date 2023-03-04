import ACTION_TYPES from '../actions/ACTION_TYPES';

const INITIAL_USER_STATE = {
  first_name: undefined,
  last_name: undefined,
  email: undefined,
};

export default function userReducer(state = INITIAL_USER_STATE, {type, payload}) {
  switch (type) {
    case ACTION_TYPES.USER.FILL_PII:
      return {
        ...state,
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
      };

    case ACTION_TYPES.USER.RESET_PII:
      return INITIAL_USER_STATE;
    
    case ACTION_TYPES.AUTH.SIGN_OUT:
      return INITIAL_USER_STATE;

    default:
      return state;
  }
}
