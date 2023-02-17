import React from 'react';

function Footer() {
  return (
    <React.Fragment>
      <br />
      <div className="ui very padded text container">
        <ul className="ui warning message">
          <li>
            As server might be dormant, first API request (google-oAuth or Login/Register button) might take upto 1
            minute to serve. Then onwards it should work at faster speeds.
          </li>
          <li>Due to missing SSL certificates on backend, your VPN could be causing CORS errors for certain routes.</li>
          <li>If you can't see a password recovery mail in your inbox, then check your SPAM folder too.</li>
        </ul>
      </div>
    </React.Fragment>
  );
}

export default Footer;
