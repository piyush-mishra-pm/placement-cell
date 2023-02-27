import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AUTH_PAYLOAD, USER_PAYLOAD, STUDENT_PAYLOAD, INTERVIEW_PAYLOAD } from '../PAYLOAD_DEFINITIONS';

export const useAuthDispatcher = () => {
    const dispatch = useDispatch();
    return useCallback((type: string, payload: AUTH_PAYLOAD | undefined) => {
        dispatch({ type, payload })
    }, [dispatch]);
}

export const useUserDispatcher = () => {
    const dispatch = useDispatch();
    return useCallback((type: string, payload: USER_PAYLOAD | undefined) => {
        dispatch({ type, payload })
    }, [dispatch]);
}

export const useStudentsDispatcher = () => {
    const dispatch = useDispatch();
    return useCallback((type: string, payload: STUDENT_PAYLOAD[] | undefined) => {
        dispatch({ type, payload })
    }, [dispatch]);
}

export const useInterviewsDispatcher = () => {
    const dispatch = useDispatch();
    return useCallback((type: string, payload: INTERVIEW_PAYLOAD[] | undefined) => {
        dispatch({ type, payload })
    }, [dispatch]);
}