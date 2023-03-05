import React from 'react';
import {useSelector} from 'react-redux';
import _ from 'lodash';

import {STATE, STUDENTS_STATE} from '../../../store/STATE_DEFINITIONS';

function RenderStudentsInterviewTable(props: any) {
  const studentsState: STUDENTS_STATE = useSelector((state: STATE) => state.students);
  const {onDeleteStudent}: {onDeleteStudent: (id?: number) => void} = props;

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
                      <i
                        className="trash alternate outline icon"
                        onClick={() => onDeleteStudent(student.student_id)}
                      ></i>
                    </td>
                    <td rowSpan={student.interviewData?.length}>{student.first_name}</td>
                    <td rowSpan={student.interviewData?.length}>{student.last_name}</td>
                    <td rowSpan={student.interviewData?.length}>{student.batch}</td>
                  </React.Fragment>
                )}
                <td key={_.uniqueId()}>{!interview || !interview.interview_id ? 'NA' : interview.interview_id}</td>
                <td key={_.uniqueId()}>{!interview || !interview.company_name ? 'NA' : interview.company_name}</td>
                <td key={_.uniqueId()}>{!interview || !interview.interview_name ? 'NA' : interview.interview_name}</td>
                <td key={_.uniqueId()}>{!interview || !interview.description ? 'NA' : interview.description}</td>
                <td key={_.uniqueId()}>{!interview || !interview.time ? 'NA' : interview.time}</td>
                <td key={_.uniqueId()}>{!interview || !interview.interview_id ? 'NA' : interview.interview_status}</td>
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
