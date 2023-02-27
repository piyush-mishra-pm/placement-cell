import React, {useState, SyntheticEvent} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {toast} from 'react-toastify';

import {useHttpClient} from '../../hooks/httpHook';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorModal from '../../components/ErrorModal';

function ResetPassword({match}: {match: any}) {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const history = useHistory();
  const {isLoading, error, sendRequest, clearErrorHandler} = useHttpClient();

  async function onSubmitHandler(e: SyntheticEvent) {
    e.preventDefault();
    try {
      const token = match.params.token;
      await sendRequest({
        successMessage: 'Password successfully reset. Try Logging in!',
        url: '/reset',
        method: 'POST',
        body: {password, token, password_confirm: passwordConfirm},
      });
      history.push('/login');
    } catch (e) {}
  }

  function renderForm() {
    return (
      <div>
        <div className="ui container" style={{width: '50%'}}>
          <h1>Reset Password</h1>
          <form className="ui form" onSubmit={onSubmitHandler}>
            <div className="field">
              <label>New Password</label>
              <input
                type="password"
                required
                name="password"
                value={password}
                placeholder="New Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Confirm New Password</label>
              <input
                type="password"
                required
                name="password_confirm"
                value={passwordConfirm}
                placeholder="Confirm New Password"
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>
            <button className="ui button" type="submit">
              Set New Password
            </button>
          </form>
          <Link to="/login">
            <p>Login instead?</p>
          </Link>
          <br />
          <Link to="/register">
            <p>Register instead?</p>
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    toast(error, {
      type: 'error',
      toastId: 'Reset-Password',
    });
  }

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorModal onCloseModal={clearErrorHandler} header={'Error!'} content={error} />}
      {renderForm()}
    </React.Fragment>
  );
}

export default ResetPassword;
