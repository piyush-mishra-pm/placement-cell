import React from 'react';

function ResetPasswordMailSent() {
  return (
    <div className="ui container">
      <h2 className="ui center aligned icon header">
        <i className="circular positive envelope icon"></i>
        Reset email sent!
      </h2>
      <div className="ui center aligned container">
        <p className="ui positive message">Please check your registered email, to reset your password!</p>
      </div>
    </div>
  );
}

export default ResetPasswordMailSent;
