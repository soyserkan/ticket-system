import { useState } from 'react';
import Router from 'next/router'
import useRequest from '../../hooks/use-request';

export default () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: { email, password, name, surname },
        onSuccess: function () { Router.push('/') }
    })

    async function onSubmit(e) {
        e.preventDefault();
        doRequest()
    }


    return <form onSubmit={onSubmit}>
        <div className='container'>
            <h1>Sign Up</h1>
            <div className="form-group">
                <label>Name</label>
                <input value={name} onChange={e => setName(e.target.value)} type="text" className="form-control" />
            </div>
            <div className="form-group">
                <label>Surname</label>
                <input value={surname} onChange={e => setSurname(e.target.value)} type="text" className="form-control" />
            </div>
            <div className="form-group">
                <label>Email Address</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="form-control" />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" />
            </div>
            {errors}
            <button className="btn btn-primary">Sign Up</button>
        </div>
    </form>
}