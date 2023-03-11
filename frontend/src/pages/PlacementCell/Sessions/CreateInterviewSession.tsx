import React, {useEffect, useState} from 'react';
import {Link, useHistory, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useSelector} from 'react-redux';
import _ from 'lodash';

import {useHttpClient} from '../../../hooks/httpHook';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorModal from '../../../components/ErrorModal';
import {AUTH_STATE, STATE, INTERVIEW_STATUS} from '../../../store/STATE_DEFINITIONS';
import {INTERVIEW_STUDENT_PAYLOAD, STUDENT_PII_PAYLOAD} from '../../../store/PAYLOAD_DEFINITIONS';
import Pagination from '../../../components/Pagination';

function CreateInterviewSession() {
  const {interviewId, scheduledPage, availablePage} = useParams<{
    interviewId: string;
    scheduledPage: string;
    availablePage: string;
  }>();

  const {isLoading, error, sendRequest, clearErrorHandler} = useHttpClient();
  const authState: AUTH_STATE = useSelector((state: STATE) => state.auth);

  const [currentStudentsData, setCurrentStudentsData] = useState<Array<INTERVIEW_STUDENT_PAYLOAD>>([]);
  const [availableStudentsData, setAvailableStudentsData] = useState<Array<STUDENT_PII_PAYLOAD>>([]);

  const [currentScheduledPage, setCurrentScheduledPage] = useState(parseInt(scheduledPage || '1'));
  const [totalScheduledPages, setTotalScheduledPages] = useState(1);
  const [currentAvailablePage, setCurrentAvailablePage] = useState(parseInt(availablePage || '1'));
  const [totalAvailablePages, setTotalAvailablePages] = useState(1);

  const NUMBER_OF_RESULTS_PER_PAGE = 2;

  const history = useHistory();

  useEffect(() => {
    // Get currently scheduled sessions of Student:
    (async () => {
      try {
        const response = await sendRequest({
          successMessage: 'Session successfully fetched!',
          url: `/sessions/interview/${interviewId}/${currentScheduledPage}/${NUMBER_OF_RESULTS_PER_PAGE}`,
          method: 'GET',
          headers: {'Content-Type': 'application/json', Authorization: `Bearer ${authState.jwt}`},
        });
        console.log('API_GETTING_STUDENT_SESSIONS', response);
        setCurrentStudentsData(response.data);
        setTotalScheduledPages(response.meta.numPages);
      } catch (e: any) {
        // Don't reset Students Redux state.
      }
    })();

    // Get sessions available for student to take:
    (async () => {
      try {
        const response = await sendRequest({
          successMessage: 'Session successfully fetched!',
          url: `sessions/interview/available/${interviewId}/${currentAvailablePage}/${NUMBER_OF_RESULTS_PER_PAGE}`,
          method: 'GET',
          headers: {'Content-Type': 'application/json', Authorization: `Bearer ${authState.jwt}`},
        });
        console.log('API_GETTING_STUDENT_AVAILABLE_FOR_INTERVIEW', response);
        setAvailableStudentsData(response.data);
        setTotalAvailablePages(response.meta.numPages);
      } catch (e: any) {
        // Don't reset Students Redux state.
      }
    })();
  }, [sendRequest, authState.jwt, interviewId, currentScheduledPage, currentAvailablePage]);

  function onDeleteStudentInterview(studentId?: number, interviewId?: number): void {
    if (Number.isNaN(studentId) || Number.isNaN(interviewId)) {
      console.error('Interview of student id is null. Cant send delete interview request.');
      return;
    }

    (async () => {
      try {
        const response = await sendRequest({
          successMessage: 'Session successfully deleted!',
          url: `/session/`,
          method: 'DELETE',
          body: {
            studentId,
            interviewId,
          },
          headers: {'Content-Type': 'application/json', Authorization: `Bearer ${authState.jwt}`},
        });
        console.log('API_GETTING_STUDENTS', response);
        history.go(0); // reload the page.
      } catch (e: any) {
        // Don't reset Students Redux state.
      }
    })();
  }

  function onAddStudentInterview(studentId?: number, interviewId?: number): void {
    if (!studentId || !interviewId) {
      console.error('Interview of student id is null. Cant send create interview request.');
      return;
    }
    console.log('Started API_ADDING_STUDENT_SESSION', studentId, interviewId);
    (async () => {
      try {
        const response = await sendRequest({
          successMessage: 'Session successfully created!',
          url: `/session`,
          method: 'POST',
          body: {
            studentId,
            interviewId,
            interviewStatus: INTERVIEW_STATUS.NO_ATTEMPT, // Default Interview status (when added)!
          },
          headers: {'Content-Type': 'application/json', Authorization: `Bearer ${authState.jwt}`},
        });
        console.log('API_ADDING_STUDENT_SESSION', response);
        history.go(0); // reload the page.
      } catch (e: any) {
        // Don't reset Students Redux state.
      }
    })();
  }

  function renderCurrentlyScheduledSessions() {
    return (
      <React.Fragment>
        <div className="ui container">
          <div className="ui centered card">
            <div className="content">
              <div className="header">Interview Details</div>
              {currentStudentsData[0] && (
                <div className="description">
                  <p className="meta">
                    ID: <b>{currentStudentsData[0] && currentStudentsData[0].interview_id}</b>
                  </p>
                  <p>
                    Company Name : <b> {currentStudentsData[0] && currentStudentsData[0].company_name} </b>
                  </p>
                  <p>
                    Name : <b>{currentStudentsData[0].interview_name}</b>
                  </p>
                  <p>
                    Time :{' '}
                    <b>{currentStudentsData[0].time && new Date(currentStudentsData[0].time * 1000).toISOString()}</b>
                  </p>
                  <p>
                    Description : <b>{currentStudentsData[0].description}</b>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="ui divider"></div>
        <div className="ui center aligned container">
          <h3 className="ui header centered">Students Scheduled</h3>
          <Pagination page={currentScheduledPage} pages={totalScheduledPages} changePage={setCurrentScheduledPage} />
          <table className="ui celled structured striped table">
            <thead className="center aligned">
              <tr>
                <th>Actions</th>
                <th>student_id</th>
                <th>first_name</th>
                <th>last_name</th>
                <th>batch</th>
                <th>interview_status</th>
              </tr>
            </thead>
            <tbody>
              {currentStudentsData.map((currentSession) => (
                <tr key={_.uniqueId()}>
                  <td>
                    <button
                      className="ui negative primary button"
                      onClick={() => onDeleteStudentInterview(currentSession.student_id, currentSession.interview_id)}
                    >
                      <i className="calendar minus outline icon"></i>
                      Delete Session
                    </button>
                  </td>
                  <td key={_.uniqueId()}>{currentSession.student_id}</td>
                  <td key={_.uniqueId()}>{currentSession.first_name}</td>
                  <td key={_.uniqueId()}>{currentSession.last_name}</td>
                  <td key={_.uniqueId()}>{currentSession.batch}</td>
                  <td key={_.uniqueId()}>
                    {currentSession.interview_status}
                    <Link
                      to={`/session/edit/${currentSession.student_id}/${currentSession.interview_id}`}
                      className="ui secondary right floated button"
                    >
                      <i className="edit alternate outline icon"></i>
                      Edit Status
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="ui divider"></div>
      </React.Fragment>
    );
  }

  function renderAvailableSessionsInfo() {
    return (
      <React.Fragment>
        <div className="ui center aligned container">
          <div className="content">
            <h3 className="ui header centered">Students available to add</h3>
            <Pagination page={currentAvailablePage} pages={totalAvailablePages} changePage={setCurrentAvailablePage} />
            <table className="ui celled structured striped table">
              <thead className="center aligned">
                <tr>
                  <th>Actions</th>
                  <th>student_id</th>
                  <th>first_name</th>
                  <th>last_name</th>
                  <th>batch</th>
                </tr>
              </thead>
              <tbody>
                {availableStudentsData &&
                  availableStudentsData.map((availableSession) => (
                    <tr key={_.uniqueId()}>
                      <td>
                        <button
                          className="ui positive primary button"
                          onClick={() => onAddStudentInterview(availableSession.student_id, parseInt(interviewId))}
                        >
                          <i className="calendar plus outline icon"></i>
                          Create Session
                        </button>
                      </td>
                      <td key={_.uniqueId()}>{availableSession.student_id}</td>
                      <td key={_.uniqueId()}>{availableSession.first_name}</td>
                      <td key={_.uniqueId()}>{availableSession.last_name}</td>
                      <td key={_.uniqueId()}>{availableSession.batch}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </React.Fragment>
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
        {renderCurrentlyScheduledSessions()}
        {renderAvailableSessionsInfo()}
      </React.Fragment>
    </div>
  );
}

export default CreateInterviewSession;
