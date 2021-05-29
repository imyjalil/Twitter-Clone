import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';

import API from '../../axios/api';
import './login.css'

class Login extends Component {
    constructor(props) {
        super(props);
        document.title = "Login"
    }
    submitHandler = (event) => {
        event.preventDefault()
        let data = {
            username: event.target.elements['logUsername'].value,
            password: event.target.elements['logPassword'].value
        }

        API.post('/login', data).then((response) => {
            if (response && response.data) {
                if (response.data.errorMessage) {
                    ReactDOM.render(response.data.errorMessage, document.getElementById('error'))
                }
                else {
                    console.log('redirecting to home')
                    localStorage.setItem('token', response.data.token)
                    this.props.history.push("/home")
                }
            }
            else {
                ReactDOM.render('<p>Unknown error</p>', document.getElementById('error'))
            }
        }).catch((error) => {
            if (error.response && error.response.data && error.response.data.errorMessage) {
                ReactDOM.render(error.response.data.errorMessage, document.getElementById('error'))
            } else {
                ReactDOM.render('<p>Unknown error</p>', document.getElementById('error'))
            }
        })



    }
    render() {
        return (
            <div>
                <div className="wrapper">
                    <div className="loginContainer">
                        <h1>Login</h1>
                        <form onSubmit={this.submitHandler}>
                            <input type="text" name="logUsername" placeholder="Username or email" defaultValue="abcdef" required></input>
                            <input type="password" name="logPassword" placeholder="Password" defaultValue="abcdef12" required></input>
                            <div id="error"></div>
                            <input type="submit" value="Login" />
                        </form>
                        <Link to="/register">Need an account?Register here.</Link>
                    </div>
                </div>
            </div>
        )
    }
}
export default Login;