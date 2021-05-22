import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './login.css'

class Login extends Component {
    constructor(props) {
        super(props);
        document.title = "Login"
    }
    render() {
        return (
            <div className="wrapper">
                <div className="loginContainer">
                    <h1>Login</h1>
                    <form>
                        <input type="text" name="logUsername" placeholder="Username or email" required></input>
                        <input type="password" name="logPassword" placeholder="Password" required></input>
                        <input type="submit" value="Login" />
                    </form>
                    <Link to="/register">Need an account?Register here.</Link>
                </div>
            </div>
        )
    }
}
export default Login;