import axios from 'axios';
import { useState } from 'react';

export default function ({ url, method, body, onSuccess }) {
    const [errors, setErrors] = useState(null);
    async function doRequest() {
        try {
            setErrors(null);
            const response = await axios[method](url, body);
            if (onSuccess) {
                onSuccess(response.data);
            }
            return response.data;
        } catch (error) {
            if (error.response) {
                setErrors(
                    <div className='alert alert-danger'>
                        <h4>Ooops...</h4>
                        <ul className='my-0'>
                            {error && error.response && error.response.data ? error.response.data.errors.map(x => (<li key={x.message}>{x.message}</li>)) : error}
                        </ul>
                    </div>
                )
            }
        }
    }
    return { doRequest, errors };
}