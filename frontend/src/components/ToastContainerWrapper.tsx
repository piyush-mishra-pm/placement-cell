import React from 'react';
import {ToastContainer} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function ToastContainerWrapper() {
  return (
    <ToastContainer
      position="top-left"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
}

export default ToastContainerWrapper;
