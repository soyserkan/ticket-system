import { useState } from 'react';
import Router from 'next/router'
import useRequest from '../../hooks/use-request';

export default () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: { email, password},
        onSuccess: function () { Router.push('/') }
    })

    async function onSubmit(e) {
        e.preventDefault();
        doRequest()
    }


    return <form onSubmit={onSubmit}>
        <div className='container'>
            <h1>Sign In</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="form-control" />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" />
            </div>
            {errors}
            <button className="btn btn-primary">Sign In</button>
        </div>
    </form>
}