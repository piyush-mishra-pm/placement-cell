import React from 'react';

function Footer() {
  return (
    <React.Fragment>
      <br />
      <div className="ui very padded text container">
        <ul className="ui warning message">
          <li>
            As server might be dormant, first few API request might take upto 5 minute to serve. Then onwards it should
            work at faster speeds. Please be patient for 5 min, and keep refreshing.
          </li>
          <li>If you can't see a password recovery mail in your inbox, then check your SPAM folder too.</li>
        </ul>
      </div>
    </React.Fragment>
  );
}

export default Footer;
