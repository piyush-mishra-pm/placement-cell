import React from 'react';
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import _ from 'lodash';

import {STATE, INTERVIEWS_STATE} from '../../../store/STATE_DEFINITIONS';

function RenderInterviewStudentsTable(props: any) {
  const interviewsState: INTERVIEWS_STATE = useSelector((state: STATE) => state.interviews);
  const {
    onDeleteInterview,
    onDeleteSession,
  }: {
    onDeleteInterview: (interviewId?: number) => void;
    onDeleteSession: (studentId?: number, interviewId?: number) => void;
  } = props;

  function renderContent() {
    return (
      <table className="ui celled structured striped table">
        <thead className="center aligned">
          <tr>
            <th rowSpan={2}>Interview-ID</th>
            <th rowSpan={2}>Interview Name</th>
            <th rowSpan={2}>Company-Name</th>
            <th rowSpan={2}>Description</th>
            <th rowSpan={2}>Time</th>
            <th colSpan={5}>Student Session Details</th>
          </tr>
          <tr>
            <th>student_id</th>
            <th>first_name</th>
            <th>last_name</th>
            <th>batch</th>
            <th>interview_status</th>
          </tr>
        </thead>
        <tbody>
          {interviewsState.map((interview) =>
            interview.studentData?.map((student, studentIndex) => (
              <tr key={_.uniqueId()}>
                {studentIndex === 0 && (
                  <React.Fragment>
                    <td rowSpan={interview.studentData?.length}>
                      {interview.interview_id}
                      <br />
                      <button
                        className="ui negative primary button"
                        onClick={() => onDeleteInterview(interview.interview_id)}
                      >
                        <i className="trash alternate outline icon"></i>
                        Delete Interview
                      </button>
                      <br />
                      <Link
                        to={`/session/create-interview-session/${interview.interview_id}`}
                        className="ui positive primary button"
                      >
                        <i className="calendar plus outline icon"></i>
                        Add Session
                      </Link>
                    </td>
                    <td rowSpan={interview.studentData?.length}>{interview.interview_name}</td>
                    <td rowSpan={interview.studentData?.length}>{interview.company_name}</td>
                    <td rowSpan={interview.studentData?.length}>{interview.description}</td>
                    <td rowSpan={interview.studentData?.length}>
                      {interview.time && new Date(interview.time * 1000).toISOString()}
                    </td>
                  </React.Fragment>
                )}
                <td key={_.uniqueId()}>
                  {!student || !student.student_id ? (
                    'NA'
                  ) : (
                    <React.Fragment>
                      {student.student_id} :
                      <button
                        className="ui negative primary button"
                        onClick={() => onDeleteSession(student.student_id, interview.interview_id)}
                      >
                        <i className="calendar minus outline icon"></i>
                        Delete Session
                      </button>
                    </React.Fragment>
                  )}
                </td>
                <td key={_.uniqueId()}>{!student || !student.first_name ? 'NA' : student.first_name}</td>
                <td key={_.uniqueId()}>{!student || !student.last_name ? 'NA' : student.last_name}</td>
                <td key={_.uniqueId()}>{!student || !student.batch ? 'NA' : student.batch}</td>
                <td key={_.uniqueId()}>
                  {!student || !student.student_id ? 'NA' : student.interview_status}
                  <br />
                  {student && student.student_id && (
                    <Link
                      to={`/session/edit/${student.student_id}/${interview.interview_id}`}
                      className="ui secondary button"
                    >
                      <i className="edit alternate outline icon"></i>
                      Edit Status
                    </Link>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  }
  return renderContent();
}

export default RenderInterviewStudentsTable;
