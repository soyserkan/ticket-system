import { useState } from 'react';
import axios from 'axios';

export default () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    async function onSubmit(e) {
        e.preventDefault();
        var response = await axios.post('/api/users/signup', {
            name, surname, email, password
        })
        console.log(response);
    }


    return <form onSubmit={onSubmit}>
        <h1>Sign Up</h1>
        <div className="form-group">
            <label>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} type="name" className="form-control" />
        </div>
        <div className="form-group">
            <label>Surname</label>
            <input value={surname} onChange={e => setSurname(e.target.value)} type="name" className="form-control" />
        </div>
        <div className="form-group">
            <label>Email Address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="form-control" />
        </div>
        <div className="form-group">
            <label>Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" />
        </div>
        <button className="btn btn-primary">Sign Up</button>
    </form>
}