import React, {SyntheticEvent, useRef, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import {toast} from 'react-toastify';

import OAuth from '../../components/OAuth';
import {useHttpClient} from '../../hooks/httpHook';
import ErrorModal from '../../components/ErrorModal';
import LoadingSpinner from '../../components/LoadingSpinner';

function RegisterForm() {
  // Creating State objects:
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const recaptchaRef: any = useRef(null);
  const history = useHistory();
  const {isLoading, error, sendRequest, clearErrorHandler} = useHttpClient();

  async function formSubmitHandler(e: SyntheticEvent) {
    e.preventDefault();
    try {
      // Get Captcha and then reset Captcha.
      const captchaToken = recaptchaRef.current.getValue();
      recaptchaRef.current.reset();

      await sendRequest({
        url: '/register',
        method: 'POST',
        successMessage: '✅ Successfully registered! Please login.',
        body: {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          password_confirm: passwordConfirm,
          captcha: captchaToken,
        },
      });
      history.push('/login');
    } catch (e: any) {}
  }

  function renderForm() {
    return (
      <div className="ui container" style={{width: '50%'}}>
        <OAuth />
        <hr />
        <h2>... or register below</h2>
        <form className="ui form" onSubmit={formSubmitHandler}>
          <div className="field required">
            <label>First Name</label>
            <input
              type="text"
              required
              name="firstName"
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Last Name</label>
            <input type="text" name="lastName" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div className="field required">
            <label>Email</label>
            <input
              type="email"
              required
              name="email"
              placeholder="Email ID"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field required">
            <label>Password</label>
            <input
              type="password"
              required
              name="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="field required">
            <label>Confirm Password</label>
            <input
              type="password"
              name="passwordConfirm"
              required
              placeholder="Confirm Password"
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>
          <ReCAPTCHA ref={recaptchaRef} sitekey={`${process.env.REACT_APP_RECAPTCHA_KEYS}`} />
          <br />
          <button className="ui positive button large" type="submit">
            Submit
          </button>
        </form>
        <br />
        <hr />
        <br />
        <Link to="/login">
          <button className="ui primary button">Login instead?</button>
        </Link>
        {error && (
          <div className="ui warning message">
            <i className="warning icon"></i>
            {error}
          </div>
        )}
      </div>
    );
  }

  if (error) {
    toast(error, {
      type: 'error',
      toastId: 'Login-Toast',
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

export default RegisterForm;
