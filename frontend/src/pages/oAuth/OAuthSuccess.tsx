import React, {useEffect} from 'react';
import {useParams, useHistory} from 'react-router-dom';

import {toast} from 'react-toastify';
import {useHttpClient} from '../../hooks/httpHook';
import {useUserDispatcher, useAuthDispatcher} from '../../store/actions/DISPATCH_HOOK_REGISTRY';
import ACTION_TYPES from '../../store/actions/ACTION_TYPES';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorModal from '../../components/ErrorModal';

function OAuthSuccess() {
  const {token} = useParams<{token: string}>();
  const history = useHistory();
  const {isLoading, error, sendRequest, clearErrorHandler} = useHttpClient();
  const userDispatcher = useUserDispatcher();
  const authDispatcher = useAuthDispatcher();

  useEffect(() => {
    // Request user details only if signed in.
    (async function onLogoutClickHandler() {
      try {
        const response = await sendRequest({
          successMessage: 'User details fetched successfully!',
          method: 'GET',
          url: '/user',
        });
        authDispatcher(ACTION_TYPES.AUTH.SIGN_IN, {userId: response.data.userId, jwt: response.data.jwt});
        userDispatcher(ACTION_TYPES.USER.FILL_PII, {
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          email: response.data.email,
        });
        history.push('/');
      } catch (e: any) {
        authDispatcher(ACTION_TYPES.AUTH.SIGN_OUT, undefined);
        userDispatcher(ACTION_TYPES.USER.RESET_PII, undefined);
      }
    })();
  }, [authDispatcher, userDispatcher, history, sendRequest]);

  if (error !== 'canceled') {
    toast(error, {
      type: 'error',
      toastId: 'oAuth-Success',
    });
  }

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner />}
      {error && error !== 'canceled' && (
        <ErrorModal onCloseModal={clearErrorHandler} header={'Error oAuth!'} content={error} />
      )}

      <h2 className="ui center aligned icon header">
        <i className="circular positive user icon"></i>
        oAuth Successful!
      </h2>
      <div className="ui center aligned container">
        <p className="ui warning message">Successful oAuth. Your jwt token is</p>
        <pre>{token}</pre>
      </div>
    </React.Fragment>
  );
}

export default OAuthSuccess;
