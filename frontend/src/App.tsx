import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import RegisterForm from './pages/Auth/RegisterForm';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import HeaderNav from './components/HeaderNav';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import ToastContainerWrapper from './components/ToastContainerWrapper';
import NotFound from './pages/NotFound';
import ResetPasswordMailSent from './pages/Auth/ResetPasswordMailSent';
import OAuthSuccess from './pages/oAuth/OAuthSuccess';
import OAuthFailure from './pages/oAuth/OAuthFailure';
import Footer from './components/Footer';
import Students from './pages/PlacementCell/Students/Students';
import Interviews from './pages/PlacementCell/Interviews/Interviews';
import Reports from './pages/PlacementCell/Reports';
import EditSession from './pages/PlacementCell/Sessions/EditSession';
import CreateStudentSession from './pages/PlacementCell/Sessions/CreateStudentSession';
import CreateInterviewSession from './pages/PlacementCell/Sessions/CreateInterviewSession';

import './App.css';
import Adzuna from './pages/PlacementCell/Adzuna/Adzuna';

function App() {
  return (
    <div>
      <BrowserRouter>
        <HeaderNav />
        <Switch>
          <Route path="/register" exact component={RegisterForm} />
          <Route path="/forgot" exact component={ForgotPassword} />
          <Route path="/reset/:token" exact component={ResetPassword} />
          <Route path="/reset_mail_sent" exact component={ResetPasswordMailSent} />
          <Route path="/login" exact component={Login} />
          <Route path="/login-failure" exact component={OAuthFailure} />
          <Route path="/login-success/:token" exact component={OAuthSuccess} />
          <Route path="/students/:page?" exact component={Students} />
          <Route path="/interviews/:page?" exact component={Interviews} />
          <Route path="/session/edit/:studentId/:interviewId" exact component={EditSession} />
          <Route
            path="/session/create-student-session/:studentId/:scheduledPage?/:availablePage?"
            exact
            component={CreateStudentSession}
          />
          <Route
            path="/session/create-interview-session/:interviewId/:scheduledPage?/:availablePage?"
            exact
            component={CreateInterviewSession}
          />
          <Route path="/reports" exact component={Reports} />
          <Route path="/external-jobs/:page?" exact component={Adzuna} />
          <Route path="/" exact component={Home} />
          <Route path="*" component={NotFound} />
        </Switch>
        <ToastContainerWrapper />
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
