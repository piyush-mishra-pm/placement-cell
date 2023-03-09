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
    </React.Fragment>
  );
}

export default Interviews;
