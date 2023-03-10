import React from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'react-toastify';
import {useSelector} from 'react-redux';
import {useHttpClient} from '../../../hooks/httpHook';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorModal from '../../../components/ErrorModal';
import {useInterviewsDispatcher} from '../../../store/actions/DISPATCH_HOOK_REGISTRY';
import ACTION_TYPES from '../../../store/actions/ACTION_TYPES';
import {AUTH_STATE, STATE} from '../../../store/STATE_DEFINITIONS';

type CreateInterviewFormData = {
  company_name: string;
  interview_name: string;
  description: string;
  dateTimePicker: Date;
};

export default function InterviewCreate() {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<CreateInterviewFormData>();

  const {isLoading, error, sendRequest, clearErrorHandler} = useHttpClient();

  const interviewsDispatcher = useInterviewsDispatcher();

  const authState: AUTH_STATE = useSelector((state: STATE) => state.auth);

  const onSubmit = handleSubmit(async ({company_name, interview_name, description, dateTimePicker}) => {
    try {
      const results = await sendRequest({
        successMessage: 'Created interview successfully!',
        url: '/interview',
        method: 'POST',
        body: {
          interview_name,
          company_name,
          description,
          time: new Date(dateTimePicker).getTime() / 1000,
        },
        headers: {Authorization: `Bearer ${authState.jwt}`},
      });
      console.log('API_CREATE_INTERVIEW_RESULTS', results);
      interviewsDispatcher(ACTION_TYPES.INTERVIEWS.CREATE_INTERVIEW, results.data);
    } catch (e: any) {
      console.error('error in student creation');
    }
  });

  function renderForm() {
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input type="submit" />
    </form>;
    return (
      <form onSubmit={onSubmit} className="ui form">
        <div className="field">
          <input placeholder="company_name" {...register('company_name', {required: true})} />
          {errors.company_name && <div className="ui pointing red basic label">First name is required.</div>}
        </div>
        <div className="field">
          <input placeholder="interview_name" {...register('interview_name', {required: true})} />
          {errors.interview_name && <div className="ui pointing red basic label">Last name is required.</div>}
        </div>
        <div className="field">
          <input placeholder="description" {...register('description', {required: true})} />
          {errors.description && (
            <div className="ui pointing red basic label">Please enter a description of interview.</div>
          )}
        </div>
        <div className="field">
          <input type="datetime-local" {...register('dateTimePicker', {valueAsDate: true, required: true})} />
          {errors.dateTimePicker && <div className="ui pointing red basic label">Please enter interview time.</div>}
        </div>
        <input type="submit" />
      </form>
    );
  }

  if (error) {
    toast(error, {
      type: 'error',
      toastId: 'Interview-Create-Toast',
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