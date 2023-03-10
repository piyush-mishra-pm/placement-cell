import React from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'react-toastify';
import { useSelector } from 'react-redux';

import {useHttpClient} from '../../../hooks/httpHook';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorModal from '../../../components/ErrorModal';
import {useStudentsDispatcher} from '../../../store/actions/DISPATCH_HOOK_REGISTRY';
import ACTION_TYPES from '../../../store/actions/ACTION_TYPES';
import { AUTH_STATE, STATE } from '../../../store/STATE_DEFINITIONS';
import {useHistory} from 'react-router-dom';

type CreateStudentFormData = {
  first_name: string;
  last_name: string;
  batch: string;
};

export default function StudentCreate() {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<CreateStudentFormData>();

  const {isLoading, error, sendRequest, clearErrorHandler} = useHttpClient();

  const studentsDispatcher = useStudentsDispatcher();

  const authState: AUTH_STATE = useSelector((state: STATE) => state.auth);
  const history = useHistory();

  const onSubmit = handleSubmit(async ({first_name, last_name, batch}) => {
    try {
      const results = await sendRequest({
        successMessage: 'Created student successfully!',
        url: '/student',
        method: 'POST',
        body: {
          first_name,
          last_name,
          batch,
        },
        headers: {Authorization: `Bearer ${authState.jwt}`},
      });
      console.log('API_CREATE_RESULTS', results);
      studentsDispatcher(ACTION_TYPES.STUDENTS.CREATE_STUDENT, results.data);
      history.go(0);
    } catch (e: any) {
      console.error('error in student creation');
    }
  });

  function renderForm() {
    return (
      <form onSubmit={onSubmit} className="ui form">
        <div className="field required">
          <input placeholder="first name" {...register('first_name', {required: true})} />
          {errors.first_name && <div className="ui pointing red basic label">First name is required.</div>}
        </div>
        <div className="field required">
          <input placeholder="last name" {...register('last_name', {required: true})} />
          {errors.last_name && <div className="ui pointing red basic label">Last name is required.</div>}
        </div>
        <div className="field required">
          <input placeholder="batch" {...register('batch', {required: true, pattern: /\d+/})} />
          {errors.batch && <div className="ui pointing red basic label">Please enter number for age.</div>}
        </div>
        <input className="ui fluid primary button" type="submit" />
      </form>
    );
  }

  if (error) {
    toast(error, {
      type: 'error',
      toastId: 'Student-Create-Toast',
    });
  }

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorModal onCloseModal={clearErrorHandler} header={'Student creation error!'} content={error} />}
      {renderForm()}
    </React.Fragment>
  );
}