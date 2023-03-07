import React from 'react';
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import _ from 'lodash';

import {STATE, STUDENTS_STATE} from '../../../store/STATE_DEFINITIONS';

function RenderStudentsInterviewTable(props: any) {
  const studentsState: STUDENTS_STATE = useSelector((state: STATE) => state.students);
  const {
    onDeleteStudent,
    onDeleteStudentInterview,
  }: {
    onDeleteStudent: (studentId?: number) => void;
    onDeleteStudentInterview: (studentId?: number, interviewId?: number) => void;
  } = props;

  function renderContent() {
    return (
      <table className="ui celled structured striped table">
        <thead className="center aligned">
          <tr>
            <th rowSpan={2}>Student-ID</th>
            <th rowSpan={2}>Student-First-Name</th>
            <th rowSpan={2}>Student-Last-Name</th>
            <th rowSpan={2}>Batch</th>
            <th colSpan={6}>Interview Session details</th>
          </tr>
          <tr>
            <th>interview_id</th>
            <th>company_name</th>
            <th>interview_name</th>
            <th>description</th>
            <th>time</th>
            <th>interview_status</th>
          </tr>
        </thead>
        <tbody>
          {studentsState.map((student) =>
            student.interviewData?.map((interview, interviewIndex) => (
              <tr key={_.uniqueId()}>
                {interviewIndex === 0 && (
                  <React.Fragment>
                    <td rowSpan={student.interviewData?.length}>
                      {student.student_id}
                      <br />
                      <button
                        className="ui negative primary button"
                        onClick={() => onDeleteStudent(student.student_id)}
                      >
                        <i className="trash alternate outline icon"></i>
                        Delete Student
                      </button>
                      <br />
                      <Link to={`/session/create/${student.student_id}`} className="ui positive primary button">
                        <i className="calendar plus outline icon"></i>
                        Add Session
                      </Link>
                    </td>
                    <td rowSpan={student.interviewData?.length}>{student.first_name}</td>
                    <td rowSpan={student.interviewData?.length}>{student.last_name}</td>
                    <td rowSpan={student.interviewData?.length}>{student.batch}</td>
                  </React.Fragment>
                )}
                <td key={_.uniqueId()}>
                  {!interview || !interview.interview_id ? (
                    'NA'
                  ) : (
                    <React.Fragment>
                      {interview.interview_id} :
                      <button
                        className="ui negative primary button"
                        onClick={() => onDeleteStudentInterview(student.student_id, interview.interview_id)}
                      >
                        <i className="calendar minus outline icon"></i>
                        Delete Session
                      </button>
                    </React.Fragment>
                  )}
                </td>
                <td key={_.uniqueId()}>{!interview || !interview.company_name ? 'NA' : interview.company_name}</td>
                <td key={_.uniqueId()}>{!interview || !interview.interview_name ? 'NA' : interview.interview_name}</td>
                <td key={_.uniqueId()}>{!interview || !interview.description ? 'NA' : interview.description}</td>
                <td key={_.uniqueId()}>{!interview || !interview.time ? 'NA' : interview.time}</td>
                <td key={_.uniqueId()}>
                  {!interview || !interview.interview_id ? 'NA' : interview.interview_status}
                  <br />
                  {interview && interview.interview_id && (
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

export default RenderStudentsInterviewTable;
