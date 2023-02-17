import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import RegisterForm from './pages/RegisterForm';
import Home from './pages/Home';
import Login from './pages/Login';
import HeaderNav from './pages/HeaderNav';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ToastContainerWrapper from './components/ToastContainerWrapper';
import NotFound from './pages/NotFound';
import ResetPasswordMailSent from './pages/ResetPasswordMailSent';
import OAuthSuccess from './pages/oAuth/OAuthSuccess';
import OAuthFailure from './pages/oAuth/OAuthFailure';

import './App.css';
import Footer from './components/Footer';

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
