import React, {useEffect} from 'react';
import {toast} from 'react-toastify';

import ACTION_TYPES from '../../store/actions/ACTION_TYPES';
import {useInterviewsDispatcher} from '../../store/actions/DISPATCH_HOOK_REGISTRY';
import {useHttpClient} from '../../hooks/httpHook';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorModal from '../../components/ErrorModal';
import {useSelector} from 'react-redux';
import {INTERVIEWS_STATE, STATE} from '../../store/STATE_DEFINITIONS';

function Interviews() {
  const {isLoading, error, sendRequest, clearErrorHandler} = useHttpClient();
  const interviewsDispatcher = useInterviewsDispatcher();
  const interviewsState: INTERVIEWS_STATE = useSelector((state: STATE) => state.interviews);

  useEffect(() => {
    (async () => {
      try {
        const response = await sendRequest({
          successMessage: 'Interviews successfully fetched!',
          url: '/interviews/1/10',
          method: 'GET',
        });
        console.log(response);
        interviewsDispatcher(ACTION_TYPES.INTERVIEWS.GET_INTERVIEWS, response.data);
      } catch (e: any) {
        // Don't reset Students Redux state.
      }
    })();
  }, [sendRequest, interviewsDispatcher]);

  function renderContent() {
    return (
      <div className="ui container">
        <h2>Interviews</h2>
        <div className="ui list">
          {interviewsState.map((interview) => (
            <div className="item" key={interview.id}>
              <div className="header">{`${interview.id}. ${interview.company_name}`}</div>
              {`${interview.interview_name} : ${interview.description} : ${interview.time}`}
            </div>
          ))}
        </div>
      </div>
    );
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
