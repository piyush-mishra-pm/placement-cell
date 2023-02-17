import React from 'react';

function OAuthFailure() {
  return (
    <div>
      <h2 className="ui center aligned icon header">
        <i className="circular positive bug icon"></i>
        oAuth Failed!
      </h2>
      <div className="ui center aligned container">
        <p className="ui warning message">oAuth Failed. Try logging in again.</p>
      </div>
    </div>
  );
}

export default OAuthFailure;
