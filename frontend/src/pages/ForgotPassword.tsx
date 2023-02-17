import React, {SyntheticEvent, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useHttpClient} from '../hooks/httpHook';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorModal from '../components/ErrorModal';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const history = useHistory();
  const {isLoading, error, sendRequest, clearErrorHandler} = useHttpClient();

  async function onSubmitHandler(e: SyntheticEvent) {
    e.preventDefault();
    try {
      await sendRequest({
        successMessage: `Please Check the Email: ${email}`,
        url: '/forgot',
        method: 'POST',
        body: {email},
      });
      setEmail('');
      history.push('/reset_mail_sent');
    } catch (e: any) {}
  }

  function renderForm() {
    return (
      <div>
        <div className="ui container" style={{width: '50%'}}>
          <h1>Forgot Password Page</h1>
          <form className="ui form" onSubmit={onSubmitHandler}>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                required
                name="email"
                value={email}
                placeholder="Email ID"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="ui button" type="submit">
              Send Reset Password Link to Email
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
      toastId: 'ForgotPassword',
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

export default ForgotPassword;
