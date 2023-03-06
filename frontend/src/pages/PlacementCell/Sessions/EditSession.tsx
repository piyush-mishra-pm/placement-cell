import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useForm} from 'react-hook-form';
import {useSelector} from 'react-redux';

import {useStudentsDispatcher} from '../../../store/actions/DISPATCH_HOOK_REGISTRY';
import {useHttpClient} from '../../../hooks/httpHook';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorModal from '../../../components/ErrorModal';
import {AUTH_STATE, STATE, INTERVIEW_STATUS} from '../../../store/STATE_DEFINITIONS';
import {STUDENT_PAYLOAD} from '../../../store/PAYLOAD_DEFINITIONS';
import {getDefaultSessionInstance} from '../../../store/PROTOTYPES';
import ACTION_TYPES from '../../../store/actions/ACTION_TYPES';

function EditSession() {
  const {studentId, interviewId} = useParams<{
    studentId: string;
    interviewId: string;
  }>();

  const {isLoading, error, sendRequest, clearErrorHandler} = useHttpClient();
  const studentsDispatcher = useStudentsDispatcher();
  const authState: AUTH_STATE = useSelector((state: STATE) => state.auth);

  const [sessionData, setSessionData] = useState<STUDENT_PAYLOAD>(getDefaultSessionInstance());
  const history = useHistory();

  useEffect(() => {
    (async () => {
      try {
        const response = await sendRequest({
          successMessage: 'Session successfully fetched!',
          url: `/session/${studentId}/${interviewId}`,
          method: 'GET',
          headers: {'Content-Type': 'application/json', Authorization: `Bearer ${authState.jwt}`},
        });
        console.log('API_GETTING_STUDENTS', response);
        setSessionData({...response.data[0]});
      } catch (e: any) {
        // Don't reset Students Redux state.
      }
    })();
  }, [sendRequest, authState.jwt, interviewId, studentId]);

  function renderContent() {
    return (
      <React.Fragment>
        <div className="ui container">
          {renderInfo()}
          {renderStatusChangeForm()}
        </div>
      </React.Fragment>
    );
  }

  function renderInfo() {
    return (
      <React.Fragment>
        <div className="ui card">
          <div className="content">
            <div className="header">Student Details</div>
            <div className="description">
              <p className="meta">
                ID: <b>{sessionData.student_id}</b>
              </p>
              <p>
                First Name : <b> {sessionData.first_name} </b>
              </p>
              <p>
                Last Name : <b>{sessionData.last_name}</b>
              </p>
              <p>
                Batch : <b>{sessionData.batch}</b>
              </p>
            </div>
          </div>
        </div>
        <div className="ui card">
          <div className="content">
            <div className="header">Interview Details</div>
            <div className="description">
              <p className="meta">
                Interview ID : <b>{sessionData.interview_id}</b>
              </p>
              <p>
                Company name : <b>{sessionData.company_name}</b>
              </p>
              <p>
                Interview Name : <b>{sessionData.interview_name}</b>
              </p>

              <p>
                Time : <b>{sessionData.time}</b>
              </p>
              <p>
                Description : <b>{sessionData.description}</b>
              </p>
              <h3 className="ui header">
                Interview Status : <b>{sessionData.interview_status}</b>
              </h3>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const onEditSessionClicked = handleSubmit(async ({interviewStatus}) => {
    if (Number.isNaN(studentId) || Number.isNaN(interviewId)) {
      console.error('Cant create Session. StudentId or InterviewId isNaN');
    }

    console.log('EDIT_SESSION_LOG', interviewStatus);
    // Send Session creation API request:
    (async () => {
      try {
        const response = await sendRequest({
          successMessage: 'Session status successfully edited!',
          url: '/session',
          method: 'PUT',
          body: {
            studentId,
            interviewId,
            interviewStatus,
          },
          headers: {'Content-Type': 'application/json', Authorization: `Bearer ${authState.jwt}`},
        });
        console.log('API_GETTING_STUDENTS', response);
        studentsDispatcher(ACTION_TYPES.SESSION.EDIT_SESSION, [
          {student_id: parseInt(studentId), interview_id: parseInt(interviewId), interview_status: interviewStatus},
        ]);
        history.goBack();
      } catch (e: any) {
        // Don't reset Students Redux state.
      }
    })();
  });

  function renderStatusChangeForm() {
    return (
      <form onSubmit={onEditSessionClicked} className="ui form">
        <div className="ui header">Choose status</div>
        <div className="field">
          <label htmlFor={INTERVIEW_STATUS.CLEARED}>
            <input
              {...register('interviewStatus', {required: true})}
              type="radio"
              name="interviewStatus"
              value={INTERVIEW_STATUS.CLEARED}
            />{' '}
            {INTERVIEW_STATUS.CLEARED}
          </label>
        </div>
        <div className="field">
          <label htmlFor={INTERVIEW_STATUS.FAILED}>
            <input
              {...register('interviewStatus', {required: true})}
              type="radio"
              name="interviewStatus"
              value={INTERVIEW_STATUS.FAILED}
            />{' '}
            {INTERVIEW_STATUS.FAILED}
          </label>
        </div>
        <div className="field">
          <label htmlFor={INTERVIEW_STATUS.ON_HOLD}>
            <input
              {...register('interviewStatus', {required: true})}
              type="radio"
              name="interviewStatus"
              value={INTERVIEW_STATUS.ON_HOLD}
            />{' '}
            {INTERVIEW_STATUS.ON_HOLD}
          </label>
        </div>
        <div className="field">
          <label htmlFor={INTERVIEW_STATUS.NO_ATTEMPT}>
            <input
              {...register('interviewStatus', {required: true})}
              type="radio"
              name="interviewStatus"
              value={INTERVIEW_STATUS.NO_ATTEMPT}
            />{' '}
            {INTERVIEW_STATUS.NO_ATTEMPT}
          </label>
        </div>
        <div className="field">
          <label htmlFor={INTERVIEW_STATUS.DISQUALIFIED}>
            <input
              {...register('interviewStatus', {required: true})}
              type="radio"
              name="interviewStatus"
              value={INTERVIEW_STATUS.DISQUALIFIED}
            />{' '}
            {INTERVIEW_STATUS.DISQUALIFIED}
          </label>
        </div>
        <div className="text-danger mt-3">
          {errors.interviewStatus?.type === 'required' && 'Choose an interview status'}
        </div>
        <input className="ui primary positive button" type="submit" />
      </form>
    );
  }

  if (error && error !== 'canceled') {
    toast(error, {
      type: 'error',
      toastId: 'Sessioms-Create-Toast',
    });
  }

  return (
    <div>
      <React.Fragment>
        {isLoading && <LoadingSpinner />}
        {error && error !== 'canceled' && (
          <ErrorModal onCloseModal={clearErrorHandler} header={'Error'} content={error} />
        )}
        {renderContent()}
      </React.Fragment>
    </div>
  );
}

export default EditSession;
