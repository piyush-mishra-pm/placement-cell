import React, {SyntheticEvent} from 'react';
import {useSelector} from 'react-redux';
import {Link, useHistory} from 'react-router-dom';

import ACTION_TYPES from '../store/actions/ACTION_TYPES';
import {AUTH_STATE, STATE} from '../store/STATE_DEFINITIONS';
import {useAuthDispatcher} from '../store/actions/DISPATCH_HOOK_REGISTRY';
import {useHttpClient} from '../hooks/httpHook';
import {toast} from 'react-toastify';
import ErrorModal from './ErrorModal';
import LoadingSpinner from './LoadingSpinner';

// todo: control 'active' tab, depending upon which screen is current screen.
function HeaderNav() {
  const authState: AUTH_STATE = useSelector((state: STATE) => state.auth);
  const authDispatcher = useAuthDispatcher();
  const history = useHistory();
  const {isLoading, error, clearErrorHandler} = useHttpClient();

  async function onLogoutClickHandler(e: SyntheticEvent) {
    e.preventDefault();
    authDispatcher(ACTION_TYPES.AUTH.SIGN_OUT, undefined);
    history.push('/login');
  }

  const loggedInUser = authState.isSignedIn;

  function renderNav() {
    return (
      <div className="ui borderless huge menu">
        <Link to="/" className="ui header item">
          Placement-Cell
        </Link>
        <div className="menu right">
          {loggedInUser && (
            <div className="item">
              <Link className="ui positive button" to="/students">
                Students
              </Link>
            </div>
          )}
          {loggedInUser && (
            <div className="item">
              <Link className="ui positive button" to="/interviews">
                Interviews
              </Link>
            </div>
          )}
          {loggedInUser && (
            <div className="item">
              <Link className="ui positive button" to="/reports">
                Reports
              </Link>
            </div>
          )}
          {loggedInUser && (
            <div className="item">
              <Link className="ui positive button" to="/external-jobs">
                External Jobs
              </Link>
            </div>
          )}
          {!loggedInUser && (
            <div className="item">
              <Link className="ui positive button" to="/register">
                Register
              </Link>
            </div>
          )}
          {!loggedInUser && (
            <div className="item">
              <Link className="ui positive button" to="/login">
                Login
              </Link>
            </div>
          )}
          {loggedInUser && (
            <div className="item">
              <Link className="ui negative button" to="/" onClick={onLogoutClickHandler}>
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    toast(error, {
      type: 'error',
      toastId: 'LogoutNav',
    });
  }

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorModal onCloseModal={clearErrorHandler} header={'Error!'} content={error} />}
      {renderNav()}
    </React.Fragment>
  );
}

export default HeaderNav;
