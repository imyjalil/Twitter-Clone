import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import API from '../../axios/api';
import './login.css'
import history from '../../history/history'

class Login extends Component {
    constructor(props) {
        super(props);
        document.title = "Login"
    }
    
    submitHandler = (event) => {
        event.preventDefault()
        console.log(this.props)
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
                    localStorage.setItem('token', response.data.token)
                    this.props.setLoggedinUser(response.data.user)
                    history.push("/home")
                }
            }
            else {
                ReactDOM.render('<p>Unknown error</p>', document.getElementById('error'))
            }
        }).catch((error) => {
            console.log(error)
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