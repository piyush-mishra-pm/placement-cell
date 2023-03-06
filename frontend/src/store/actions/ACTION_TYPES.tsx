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
    DELETE_STUDENT_INTERVIEW: 'DELETE_STUDENT_INTERVIEW',
  },

  SESSION: {
    // Unique entity comprised of a student and an interview.
    CREATE_SESSION: 'CREATE_SESSION',
    DELETE_SESSION: 'DELETE_SESSION',
    EDIT_SESSION: 'EDIT_SESSION',
  },

  INTERVIEWS: {
    GET_INTERVIEWS: 'GET_INTERVIEWS',
  },
};

export default ACTION_TYPES;
