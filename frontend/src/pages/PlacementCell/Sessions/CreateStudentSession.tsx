import React, {useEffect, useState} from 'react';
import {Link, useHistory, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useSelector} from 'react-redux';
import _ from 'lodash';

import {useHttpClient} from '../../../hooks/httpHook';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorModal from '../../../components/ErrorModal';
import {AUTH_STATE, STATE, INTERVIEW_STATUS} from '../../../store/STATE_DEFINITIONS';
import {INTERVIEW_PAYLOAD, STUDENT_PAYLOAD} from '../../../store/PAYLOAD_DEFINITIONS';
import Pagination from '../../../components/Pagination';

function CreateStudentSession() {
  const {studentId, scheduledPage, availablePage} = useParams<{
    studentId: string;
    scheduledPage: string;
    availablePage: string;
  }>();

  const {isLoading, error, sendRequest, clearErrorHandler} = useHttpClient();
  const authState: AUTH_STATE = useSelector((state: STATE) => state.auth);

  const [currentSessionsData, setCurrentSessionsData] = useState<Array<STUDENT_PAYLOAD>>([]);
  const [availableSessionsData, setAvailableSessionsData] = useState<Array<INTERVIEW_PAYLOAD>>([]);

  const [currentScheduledPage, setCurrentScheduledPage] = useState(parseInt(scheduledPage || '1'));
  const [totalScheduledPages, setTotalScheduledPages] = useState(1);
  const [currentAvailablePage, setCurrentAvailablePage] = useState(parseInt(availablePage || '1'));
  const [totalAvailablePages, setTotalAvailablePages] = useState(1);

  const NUMBER_OF_RESULTS_PER_PAGE = 3;
  const history = useHistory();

  useEffect(() => {
    // Get currently scheduled sessions of Student:
    (async () => {
      try {
        const response = await sendRequest({
          successMessage: 'Session successfully fetched!',
          url: `/sessions/student/${studentId}/${currentScheduledPage}/${NUMBER_OF_RESULTS_PER_PAGE}`,
          method: 'GET',
          headers: {'Content-Type': 'application/json', Authorization: `Bearer ${authState.jwt}`},
        });
        console.log('API_GETTING_STUDENT_SESSIONS', response);
        setCurrentSessionsData(response.data);
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
          url: `sessions/student/available/${studentId}/${currentAvailablePage}/${NUMBER_OF_RESULTS_PER_PAGE}`,
          method: 'GET',
          headers: {'Content-Type': 'application/json', Authorization: `Bearer ${authState.jwt}`},
        });
        console.log('API_GETTING_STUDENT_AVAILABLE_SESSIONS', response);
        setAvailableSessionsData(response.data);
        setTotalAvailablePages(response.meta.numPages);
      } catch (e: any) {
        // Don't reset Students Redux state.
      }
    })();
  }, [sendRequest, authState.jwt, studentId, currentAvailablePage, currentScheduledPage]);

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
              <div className="header">Student Details</div>
              {currentSessionsData[0] && (
                <div className="description">
                  <p className="meta">
                    ID: <b>{currentSessionsData[0] && currentSessionsData[0].student_id}</b>
                  </p>
                  <p>
                    First Name : <b> {currentSessionsData[0] && currentSessionsData[0].first_name} </b>
                  </p>
                  <p>
                    Last Name : <b>{currentSessionsData[0].last_name}</b>
                  </p>
                  <p>
                    Batch : <b>{currentSessionsData[0].batch}</b>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="ui divider"></div>
        <div className="ui center aligned container">
          <h3 className="ui header centered">Already registered interviews</h3>
          {currentSessionsData[0] && currentSessionsData[0] && currentSessionsData[0].student_id ? (
            renderTableAlreadyRegistered()
          ) : (
            <div className="ui warning label">No registered interviews for student.</div>
          )}
        </div>
        <div className="ui divider"></div>
      </React.Fragment>
    );
  }

  function renderTableAlreadyRegistered() {
    return (
      <React.Fragment>
        <Pagination page={currentScheduledPage} pages={totalScheduledPages} changePage={setCurrentScheduledPage} />
        <table className="ui celled structured striped table">
          <thead className="center aligned">
            <tr>
              <th>Actions</th>
              <th>interview_id</th>
              <th>company_name</th>
              <th>interview_name</th>
              <th>description</th>
              <th>time</th>
              <th>interview_status</th>
            </tr>
          </thead>
          <tbody>
            {currentSessionsData.map((currentSession) => (
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
                <td key={_.uniqueId()}>{currentSession.interview_id}</td>
                <td key={_.uniqueId()}>{currentSession.company_name}</td>
                <td key={_.uniqueId()}>{currentSession.interview_name}</td>
                <td key={_.uniqueId()}>{currentSession.description}</td>
                <td key={_.uniqueId()}>{currentSession.time && new Date(currentSession.time * 1000).toISOString()}</td>
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
      </React.Fragment>
    );
  }

  function renderAvailableSessionsInfo() {
    return (
      <React.Fragment>
        <div className="ui center aligned container">
          <div className="content">
            <h3 className="ui header centered">More interviews available for Student.</h3>
            {availableSessionsData && availableSessionsData[0] && availableSessionsData[0].interview_id ? (
              renderTableAvailableSessions()
            ) : (
              <div className="ui warning label">No more interviews available for the student to register in.</div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }

  function renderTableAvailableSessions() {
    return (
      <React.Fragment>
        <Pagination page={currentAvailablePage} pages={totalAvailablePages} changePage={setCurrentAvailablePage} />
        <div className="description">
          <table className="ui celled structured striped table">
            <thead className="center aligned">
              <tr>
                <th>Actions</th>
                <th>interview_id</th>
                <th>company_name</th>
                <th>interview_name</th>
                <th>description</th>
                <th>time</th>
              </tr>
            </thead>
            <tbody>
              {availableSessionsData &&
                availableSessionsData.map((availableSession) => (
                  <tr key={_.uniqueId()}>
                    <td>
                      <button
                        className="ui positive primary button"
                        onClick={() => onAddStudentInterview(parseInt(studentId), availableSession.interview_id)}
                      >
                        <i className="calendar plus outline icon"></i>
                        Create Session
                      </button>
                    </td>
                    <td key={_.uniqueId()}>{availableSession.interview_id}</td>
                    <td key={_.uniqueId()}>{availableSession.company_name}</td>
                    <td key={_.uniqueId()}>{availableSession.interview_name}</td>
                    <td key={_.uniqueId()}>{availableSession.description}</td>
                    <td key={_.uniqueId()}>
                      {availableSession.time && new Date(availableSession.time * 1000).toISOString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
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

export default CreateStudentSession;
