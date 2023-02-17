import ACTION_TYPES from '../actions/ACTION_TYPES';

const INITIAL_AUTH_STATE = {
  isSignedIn: null,
  userId: null,
  jwt: null,
};

export default function authReducer(state = INITIAL_AUTH_STATE, {type, payload}) {
  switch (type) {
    case ACTION_TYPES.AUTH.SIGN_IN:
      return {
        ...state,
        isSignedIn: true,
        userId: payload.userId,
        jwt: payload.jwt,
      };

    case ACTION_TYPES.AUTH.SIGN_OUT:
      return INITIAL_AUTH_STATE;

    default:
      return state;
  }
}
