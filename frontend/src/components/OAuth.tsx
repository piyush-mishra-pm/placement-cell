import React from 'react';

function OAuth() {
  return (
    <div className="ui segment">
      <h2>Login with Google</h2>
      <div className="ui container">
        <a className="ui google plus button" href={process.env.REACT_APP_BE_API + '/api/v1/auth/google'}>
          <i className="google plus icon"></i>
          Google Login
        </a>
      </div>
    </div>
  );
}

export default OAuth;
