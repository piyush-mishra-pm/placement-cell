import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import ACTION_TYPES from '../../../store/actions/ACTION_TYPES';
import {useInterviewsDispatcher} from '../../../store/actions/DISPATCH_HOOK_REGISTRY';
import {useHttpClient} from '../../../hooks/httpHook';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorModal from '../../../components/ErrorModal';
import {useSelector} from 'react-redux';
import {STATE, AUTH_STATE} from '../../../store/STATE_DEFINITIONS';
import RenderInterviewStudentsTable from './RenderInterviewStudentsTable';
import InterviewCreate from './InterviewCreate';

function Interviews() {
  const {isLoading, error, sendRequest, clearErrorHandler} = useHttpClient();
  const interviewsDispatcher = useInterviewsDispatcher();
  const authState: AUTH_STATE = useSelector((state: STATE) => state.auth);

  useEffect(() => {
    (async () => {
      try {
        const response = await sendRequest({
          successMessage: 'Interviews successfully fetched!',
          url: '/interviews/1/10',
          method: 'GET',
          headers: {Authorization: `Bearer ${authState.jwt}`},
        });
        console.log('API_GET_INTERVIEWS', response);
        interviewsDispatcher(ACTION_TYPES.INTERVIEWS.GET_INTERVIEWS, response.data);
      } catch (e: any) {
        // Don't reset Students Redux state.
      }
    })();
  }, [sendRequest, interviewsDispatcher, authState.jwt]);

    function renderContent() {
      return (
        <div className="ui container">
          <h2>Interviews</h2>
          <InterviewCreate />
          <RenderInterviewStudentsTable onDeleteInterview={deleteInterview} onDeleteSession={deleteSession} />
        </div>
      );
    }

    function deleteInterview(interviewId?: number) {
      if (!interviewId) return;

      (async () => {
        try {
          const response = await sendRequest({
            successMessage: 'Student successfully deleted!',
            url: `/interview/${interviewId}`,
            method: 'DELETE',
            headers: {Authorization: `Bearer ${authState.jwt}`},
          });
          console.log('API_DELETING_INTERVIEW', response);
          interviewsDispatcher(ACTION_TYPES.INTERVIEWS.DELETE_INTERVIEW, response.data);
        } catch (e: any) {
          // Don't reset Students Redux state.
        }
      })();
    }

    function deleteSession(studentId: number, interviewId: number) {
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
              studentId,
              interviewId,
            },
            headers: {'Content-Type': 'application/json', Authorization: `Bearer ${authState.jwt}`},
          });
          console.log('API_DELETING_STUDENT_INTERVIEW', response);
          interviewsDispatcher(ACTION_TYPES.SESSION.DELETE_SESSION, [
            {student_id: studentId, interview_id: interviewId},
          ]);
        } catch (e: any) {
          // Don't reset Students Redux state.
        }
      })();
    }

    if (error && error !== 'canceled') {
      toast(error, {
        type: 'error',
        toastId: 'Interviews-Toast',
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

export default Interviews;
