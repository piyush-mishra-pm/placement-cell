import React, {useState} from 'react';
import CsvDownloadButton from 'react-json-to-csv';
import {useSelector} from 'react-redux';
import {toast} from 'react-toastify';

import ErrorModal from '../../components/ErrorModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import {useHttpClient} from '../../hooks/httpHook';
import {STUDENT_PAYLOAD} from '../../store/PAYLOAD_DEFINITIONS';
import {getDefaultSessionInstance} from '../../store/PROTOTYPES';
import {AUTH_STATE, STATE} from '../../store/STATE_DEFINITIONS';

function Reports() {
  const {isLoading, error, sendRequest, clearErrorHandler} = useHttpClient();
  const [studentData, setStudentData] = useState<Array<STUDENT_PAYLOAD>>();
  const authState: AUTH_STATE = useSelector((state: STATE) => state.auth);

  async function onDownloadClicked() {
    try {
      const response = await sendRequest({
        successMessage: 'Students data successfully fetched!',
        url: '/students/1/10000', // upto 10K entries.
        method: 'GET',
        headers: {Authorization: `Bearer ${authState.jwt}`},
      });
      console.log('API_GETTING_STUDENTS', response);
      setStudentData(response.data);
    } catch (e: any) {
      // Don't reset Students Redux state.
    }
  }

  function renderContent() {
    return (
      <div className="ui container">
        {studentData ? (
          <CsvDownloadButton
            data={studentData}
            delimiter="|"
            headers={Object.keys(getDefaultSessionInstance())}
            className="ui massive positive fluid button"
          >
            <i className="download icon"></i> Download data
          </CsvDownloadButton>
        ) : (
          <button className="ui massive primary fluid button" onClick={onDownloadClicked}>
            <i className="external square icon"></i> Fetch Student Interview Data
          </button>
        )}
        ;
      </div>
    );
  }

  if (error) {
    toast(error, {
      type: 'error',
      toastId: 'Students-Toast',
    });
  }

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner />}
      {error && error !== 'canceled' && (
        <ErrorModal onCloseModal={clearErrorHandler} header={'Download failed'} content={error} />
      )}
      {renderContent()}
    </React.Fragment>
  );
}

export default Reports;
