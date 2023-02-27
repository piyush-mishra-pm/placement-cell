import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import RegisterForm from './pages/Auth/RegisterForm';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import HeaderNav from './pages/HeaderNav';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import ToastContainerWrapper from './components/ToastContainerWrapper';
import NotFound from './pages/NotFound';
import ResetPasswordMailSent from './pages/Auth/ResetPasswordMailSent';
import OAuthSuccess from './pages/oAuth/OAuthSuccess';
import OAuthFailure from './pages/oAuth/OAuthFailure';
import Footer from './components/Footer';
import Students from './pages/PlacementCell/Students';
import Interviews from './pages/PlacementCell/Interviews';

import './App.css';
import Reports from './pages/PlacementCell/Reports';

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
          <Route path="/students" exact component={Students} />
          <Route path="/interviews" exact component={Interviews} />
          <Route path="/reports" exact component={Reports} />
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
