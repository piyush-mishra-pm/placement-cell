import {combineReducers} from 'redux';
import authReducer from './authReducer';
import userReducer from './userReducer';
import studentsReducer from './studentsReducer';

export default combineReducers({
  auth: authReducer,
  user: userReducer,
  students: studentsReducer,
});
