import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import ACTION_TYPES from '../../../store/actions/ACTION_TYPES';
import {useStudentsDispatcher} from '../../../store/actions/DISPATCH_HOOK_REGISTRY';
import {useHttpClient} from '../../../hooks/httpHook';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorModal from '../../../components/ErrorModal';
import {useSelector} from 'react-redux';
import {AUTH_STATE, STATE} from '../../../store/STATE_DEFINITIONS';
import StudentCreate from './StudentCreate';
import RenderStudentsInterviewTable from './RenderStudentsInterviewTable';

function Students() {
  const {isLoading, error, sendRequest, clearErrorHandler} = useHttpClient();
  const studentsDispatcher = useStudentsDispatcher();
  const authState: AUTH_STATE = useSelector((state: STATE) => state.auth);

  useEffect(() => {
    (async () => {
      try {
        const response = await sendRequest({
          successMessage: 'Studenst successfully fetched!',
          url: '/students/1/15',
          method: 'GET',
          headers: {Authorization: `Bearer ${authState.jwt}`},
        });
        console.log('API_GETTING_STUDENTS', response);
        studentsDispatcher(ACTION_TYPES.STUDENTS.GET_STUDENTS, response.data);
      } catch (e: any) {
        // Don't reset Students Redux state.
      }
    })();
  }, [sendRequest, studentsDispatcher, authState.jwt]);

  function deleteStudent(studentId?: number) {
    if (!studentId) return;

    (async () => {
      try {
        const response = await sendRequest({
          successMessage: 'Student successfully deleted!',
          url: `/student/${studentId}`,
          method: 'DELETE',
          headers: {Authorization: `Bearer ${authState.jwt}`},
        });
        console.log('API_DELETING_STUDENT', response);
        studentsDispatcher(ACTION_TYPES.STUDENTS.DELETE_STUDENT, response.data);
      } catch (e: any) {
        // Don't reset Students Redux state.
      }
    })();
  }

  function deleteStudentInterview(studentId: number, interviewId: number) {
    if (!studentId || !interviewId) {
      console.error(`studentId ${studentId} or interviewId ${interviewId} is null`);
    }

    (async () => {
      try {
        const response = await sendRequest({
          successMessage: 'Student Interview session successfully deleted!',
          url: `/session`,
          method: 'DELETE',
          body: {
            studentId: studentId,
            interviewId: interviewId,
          },
          headers: {'Content-Type': 'application/json', Authorization: `Bearer ${authState.jwt}`},
        });
        console.log('API_DELETING_STUDENT_INTERVIEW', response);
        studentsDispatcher(ACTION_TYPES.STUDENTS.DELETE_STUDENT_INTERVIEW, [
          {student_id: studentId, interview_id: interviewId},
        ]);
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
        <RenderStudentsInterviewTable
          onDeleteStudent={deleteStudent}
          onDeleteStudentInterview={deleteStudentInterview}
        />
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
