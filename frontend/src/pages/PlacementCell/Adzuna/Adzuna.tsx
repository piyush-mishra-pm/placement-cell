import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {useParams} from 'react-router-dom';
import _ from 'lodash';

import {useHttpClient} from '../../../hooks/httpHook';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorModal from '../../../components/ErrorModal';
import {AUTH_STATE, STATE} from '../../../store/STATE_DEFINITIONS';
import {useSelector} from 'react-redux';
import {EXTERNAL_JOB_PAYLOAD_OBJECT} from '../../../store/PAYLOAD_DEFINITIONS';
import {getDefaultExternalJobsInstance} from '../../../store/PROTOTYPES';
import Pagination from '../../../components/Pagination';

function Adzuna() {
  const {page} = useParams<{
    page: string;
  }>();
  const [currentPage, setCurrentPage] = useState(parseInt(page || '1'));
  const [totalPages, setTotalPages] = useState(1);

  const {isLoading, error, sendRequest, clearErrorHandler} = useHttpClient();
  const authState: AUTH_STATE = useSelector((state: STATE) => state.auth);
  const [externalJobsResult, setExternalJobsResult] = useState<EXTERNAL_JOB_PAYLOAD_OBJECT>({
    results: [getDefaultExternalJobsInstance()],
    count: 0,
  });
  const RESULTS_PER_PAGE = 20;
  useEffect(() => {
    (async () => {
      try {
        const response = await sendRequest({
          successMessage: 'Successfully fetched external jobs!',
          url: `/adzuna/itjobs/${currentPage || 1}/${RESULTS_PER_PAGE}`,
          method: 'GET',
          headers: {Authorization: `Bearer ${authState.jwt}`},
        });
        console.log('API_GETTING_EXTERNAL_JOBS', response.data);
        setExternalJobsResult(response.data);
        setTotalPages(Math.ceil(response.data.count / RESULTS_PER_PAGE));
      } catch (e: any) {
        // Don't reset Students Redux state.
      }
    })();
  }, [sendRequest, authState.jwt, currentPage]);

  function renderContent() {
    return (
      <div className="ui container">
        <Pagination page={currentPage} pages={totalPages} changePage={setCurrentPage} />
        <div>
          Total results in Adzuna API: {(externalJobsResult && externalJobsResult.count) || 0}
          <br />
          Page showing results:{' '}
          {(externalJobsResult && externalJobsResult.results && externalJobsResult.results.length) || 0}
        </div>
        <table className="ui celled structured striped table">
          <thead className="center aligned">
            <tr>
              <th rowSpan={2}>Company Name</th>
              <th rowSpan={2}>Title</th>
              <th rowSpan={2}>Description</th>
              <th rowSpan={2}>Location</th>
              <th rowSpan={2}>Contract Type</th>
              <th rowSpan={2}>Contract Time</th>
              <th rowSpan={2}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {externalJobsResult &&
              externalJobsResult.results &&
              externalJobsResult.results.map((job) => (
                <tr key={_.uniqueId()}>
                  <td key={_.uniqueId()}>
                    <a href={job.redirect_url} target="_blank" rel="noopener noreferrer">
                      {!job.company?.display_name ? 'NA' : job.company.display_name}
                    </a>
                  </td>
                  <td key={_.uniqueId()}>
                    <a href={job.redirect_url} target="_blank" rel="noopener noreferrer">
                      {!job.title ? 'NA' : job.title}
                    </a>
                  </td>
                  <td key={_.uniqueId()}>{!job.description ? 'NA' : job.description}</td>
                  <td key={_.uniqueId()}>{!job.location?.display_name ? 'NA' : job.location.display_name}</td>
                  <td key={_.uniqueId()}>{!job.contract_type ? 'NA' : job.contract_type}</td>
                  <td key={_.uniqueId()}>{!job.contract_time ? 'NA' : job.contract_time}</td>
                  <td key={_.uniqueId()}>{!job.created ? 'NA' : job.created}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (error && error !== 'canceled') {
    toast(error, {
      type: 'error',
      toastId: 'Students-Toast',
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

export default Adzuna;
