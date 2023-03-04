import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import ACTION_TYPES from '../../../store/actions/ACTION_TYPES';
import {useStudentsDispatcher} from '../../../store/actions/DISPATCH_HOOK_REGISTRY';
import {useHttpClient} from '../../../hooks/httpHook';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorModal from '../../../components/ErrorModal';
import {useSelector} from 'react-redux';
import {AUTH_STATE, STATE, STUDENTS_STATE} from '../../../store/STATE_DEFINITIONS';
import StudentCreate from './StudentCreate';

function Students() {
  const {isLoading, error, sendRequest, clearErrorHandler} = useHttpClient();
  const studentsDispatcher = useStudentsDispatcher();
  const studentsState: STUDENTS_STATE = useSelector((state: STATE) => state.students);
  const authState: AUTH_STATE = useSelector((state:STATE)=>state.auth);

  useEffect(() => {
    (async () => {
      try {
        const response = await sendRequest({
          successMessage: 'Studenst successfully fetched!',
          url: '/students/1/10',
          method: 'GET',
          headers: {'Authorization': `Bearer ${authState.jwt}`}
        });
        console.log(response);
        studentsDispatcher(ACTION_TYPES.STUDENTS.GET_STUDENTS, response.data);
      } catch (e: any) {
        // Don't reset Students Redux state.
      }
    })();
  }, [sendRequest, studentsDispatcher,authState.jwt]);

  function deleteStudent(studentId: number | null | undefined) {
    if (!studentId) return;

    (async () => {
      try {
        const response = await sendRequest({
          successMessage: 'Student successfully deleted!',
          url: `/student/${studentId}`,
          method: 'DELETE',
          headers: {'Authorization': `Bearer ${authState.jwt}`}
        });
        console.log('Deleting student:', response);
        studentsDispatcher(ACTION_TYPES.STUDENTS.DELETE_STUDENT, response.data);
      } catch (e: any) {
        // Don't reset Students Redux state.
      }
    })();
  }

  function renderContent() {
    return (
      <div className="ui container">
        <h2>Students</h2>
        <StudentCreate />
        <div className="ui list">
          {studentsState.map((student) => (
            <div className="item" key={student.id}>
              <div className="header">{`${student.id}. ${student.first_name} ${student.last_name}`}</div>
              {student.batch}
              <i className="trash alternate outline icon" onClick={() => deleteStudent(student.id)}></i>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && error !== 'canceled') {
    toast(error, {
      type: 'error',
      toastId: 'Students-Toast',
    });
  }

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner />}
      {error && error !== 'canceled' && (
        <ErrorModal onCloseModal={clearErrorHandler} header={'Error'} content={error} />
      )}
      {renderContent()}
    </React.Fragment>
  );
}

export default Students;
