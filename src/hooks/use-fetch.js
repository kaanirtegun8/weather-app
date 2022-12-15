import { useCallback, useState } from "react"


const useFetch = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const sendRequest = useCallback(async (requestConfig, applyData) => {
        setIsLoading(true);
        try {
            const response = await fetch(requestConfig.url, {
                method: requestConfig.method || 'GET',
                body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
                headers: requestConfig.headers || {},
            })

            if(!response.ok){
                throw new Error('!request failed');
            }

            const data = await response.json();
            applyData(data);

        } catch (error) {
            setError(error)
        }
        setIsLoading(false);
    },[])

    return {
        error,
        isLoading,
        sendRequest,
    }
}

export default useFetch;