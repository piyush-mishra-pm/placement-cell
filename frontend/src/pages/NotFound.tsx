import React from 'react';
import {useLocation} from 'react-router-dom';

function NotFound() {
  const location = useLocation();
  return (
    <div>
      <h2 className="ui center aligned icon header">
        <i className="circular bug icon"></i>
        Page Not found!
      </h2>
      <div className="ui center aligned container">
        <p className="ui warning message">
          URL <span style={{fontStyle: 'italic'}}> {location.pathname}</span> doesn't exist.
        </p>
      </div>
    </div>
  );
}

export default NotFound;
