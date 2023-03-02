const ACTION_TYPES = {
  AUTH: {
    SIGN_IN: 'SIGN_IN',
    SIGN_OUT: 'SIGN_OUT',
  },

  USER: {
    // User's personally identifiable information.
    FILL_PII: 'FILL_PII',
    RESET_PII: 'RESET_PII',
  },

  STUDENTS: {
    GET_STUDENTS: 'GET_STUDENTS',
    GET_STUDENT: 'GET_STUDENT',
    CREATE_STUDENT: 'CREATE_STUDENT',
    DELETE_STUDENT: 'DELETE_STUDENT',
  },

  INTERVIEWS: {
    GET_INTERVIEWS: 'GET_INTERVIEWS',
  },
};

export default ACTION_TYPES;
