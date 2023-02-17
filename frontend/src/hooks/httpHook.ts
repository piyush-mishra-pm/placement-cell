import { useState, useCallback, useRef, useEffect } from 'react';
import apiWrapper from '../apis/apiWrapper';
import { toast } from 'react-toastify';

export interface useHttpClientProps {
    successMessage?: string;
    url?: string;
    method?: string;
    body?: any;
    headers?: any;
    timeout?: number;
}

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>();
    const activeHttpRequests = useRef<AbortController[]>([]); // Stores data across re-render cycles.

    const sendRequest = useCallback(
        async (props: useHttpClientProps) => {
            setIsLoading(true);

            const httpAbortController = new AbortController();
            activeHttpRequests.current.push(httpAbortController);

            try {
                console.log(apiWrapper.getUri());
                const response = await toast.promise(apiWrapper.request({
                    data: props.body || null,
                    signal: httpAbortController.signal,
                    method: props.method || 'GET',
                    url: props.url || '',
                    timeout: props.timeout || 60000,//1min
                    headers: props.headers || {
                        'Content-Type': 'application/json'
                    },
                }), {
                    // pending: 'Promise is pending', // Using LoadingSpinner component
                    success: `${props.successMessage || 'Successful!'} 👌`,
                    // error: 'Promise rejected 🤯' // Using ErrorModal for this.
                });

                const data = await response.data;

                activeHttpRequests.current = activeHttpRequests.current.filter(
                    requestController => requestController !== httpAbortController
                );

                return data;
            } catch (err: any) {
                setError((err.response && err.response.data && err.response.data.message) || (err && err.message) || 'Error occurred');
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    function clearErrorHandler() {
        setError(null);
    }

    // Runs when this element mounts.
    useEffect(() => {
        return () => {
            // Returned function: Runs a clean up logic when this element unmounts.
            // eslint-disable-next-line react-hooks/exhaustive-deps
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
        };
    }, []);


    return { isLoading, error, sendRequest, clearErrorHandler };
}
