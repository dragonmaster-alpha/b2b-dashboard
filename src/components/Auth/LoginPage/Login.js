import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import "../../../assets/css/login.css";
import { userActions } from '../actions';
import config from '../../../config'
import { history } from '../helpers';

export default function Login() {
    const [inputs, setInputs] = useState({
        username: '',
        password: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const { username, password } = inputs;
    const loggingIn = useSelector(state => state.authentication.loggingIn);
    const dispatch = useDispatch();
    
    // reset login status
    useEffect(() => { 
        dispatch(userActions.logout()); 
    }, []);    

    function handleChange(e) {
        const { name, value } = e.target;
        setInputs(inputs => ({ ...inputs, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        setSubmitted(true);
        if (username && password) {
            // get return url from location state or default to home page
            // const { from } = location.state || { from: { pathname: "admin/home" } };
            // dispatch(userActions.login(username, password, from));
            let data = {username: username, password: password};
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            };
            fetch(config.apiUrl + '/auth/login', requestOptions)
                .then(response => response.json())
                .then(result => 
                {
                    if (result.success) {
                        data.token = "fake-jwt-token";
                        data.accessToken = result.data.access_token;
                        data.refreshToken = result.data.refresh_token;
                        data.expiresIn = result.data.expires_in;
                        data.refreshExpiresIn = result.data.refresh_expires_in;
                        data.superadmin = result.data.superadmin;
                        localStorage.setItem('user', JSON.stringify(data));
                        
                        history.push('/admin/home');
                    }
                });
        }
    }

    return (
        <div className="login_div">
            <h2 className="login_title">Login</h2>
            <form name="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input type="text" name="username" value={username} onChange={handleChange} className={'form-control' + (submitted && !username ? ' is-invalid' : '')} />
                    {submitted && !username &&
                        <div className="invalid-feedback">Email is required</div>
                    }
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={password} onChange={handleChange} className={'form-control' + (submitted && !password ? ' is-invalid' : '')} />
                    {submitted && !password &&
                        <div className="invalid-feedback">Password is required</div>
                    }
                </div>
                <div className="form-group" style={{"display":"flex", "justifyContent":"space-between"}}>
                    <button className="btn btn-primary login">
                        {loggingIn && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}


