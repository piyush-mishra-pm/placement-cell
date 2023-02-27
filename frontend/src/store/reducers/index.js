import {combineReducers} from 'redux';
import authReducer from './authReducer';
import userReducer from './userReducer';
import studentsReducer from './studentsReducer';
import interviewsReducer from './interviewsReducer';

export default combineReducers({
  auth: authReducer,
  user: userReducer,
  students: studentsReducer,
  interviews: interviewsReducer,
});
