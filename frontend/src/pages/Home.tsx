import React from 'react';
import {useSelector} from 'react-redux';

import {AUTH_STATE, STATE, USER_STATE} from '../store/STATE_DEFINITIONS';

function Home() {
  const authState: AUTH_STATE = useSelector((state: STATE) => state.auth);
  const userState: USER_STATE = useSelector((state: STATE) => state.user);

  const loggedInStatusMessage = () => {
    return authState.isSignedIn
      ? `Hi, ${userState.first_name} ${userState.last_name}`
      : 'Unauthenticated user! Not logged in yet!';
  };

  return (
    <React.Fragment>
      <div className="ui container">
        <h1>Home Page</h1>
        <h3>{loggedInStatusMessage()}</h3>
      </div>
    </React.Fragment>
  );
}

export default Home;
