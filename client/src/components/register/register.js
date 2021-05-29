import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';

import API from '../../axios/api';
import history from '../../history/history'
import './register.css'

class Register extends Component {
    constructor(props) {
        super(props);
        document.title = "Register"
    }

    validatePassword() {
        var passwordField = document.getElementById("password")
        var passwordConfField = document.getElementById("passwordConf")
        if (passwordField.value !== passwordConfField.value) {
            ReactDOM.render('Passwords do not match', document.getElementById('error'))
            return false;
        }
        else {
            ReactDOM.render(null, document.getElementById('error'))
        }
        return true;
    }

    submitHandler = async (event) => {
        event.preventDefault()
        if (!this.validatePassword()) return;
        let data = {
            firstName: event.target.elements['firstName'].value,
            lastName: event.target.elements['lastName'].value,
            username: event.target.elements['username'].value,
            email: event.target.elements['email'].value,
            password: event.target.elements['password'].value
        }
        const response = await API.post('/register', data)
        if (response && response.data) {
            if (response.data.errorMessage) {
                ReactDOM.render(response.data.errorMessage, document.getElementById('error'))
            }
            else {
                console.log('redirecting to login')
                this.props.history.push("/login")
            }
        }
        else {
            ReactDOM.render('Unknown error', document.getElementById('error'))
        }
    }

    render() {
        return (
            <div className="wrapper">
                <div className="loginContainer">
                    <h1>Register</h1>
                    <form onSubmit={this.submitHandler}>

                        <input type="text" name="firstName" placeholder="First Name" defaultValue="abc" required></input>
                        <input type="text" name="lastName" placeholder="Last Name" defaultValue="def" required></input>
                        <input type="text" name="username" placeholder="Username" defaultValue="abcdef" required></input>
                        <input type="email" name="email" placeholder="Email" defaultValue="abc@def.com" required></input>
                        <input id="password" type="password" name="password" placeholder="Password" defaultValue="abcdef12" required></input>
                        <input id="passwordConf" type="password" name="passwordConf" placeholder="Confirm Password" defaultValue="abcdef12" required onChange={this.validatePassword}></input>
                        <div id="error"></div>
                        <input type="submit" value="Register" />
                    </form>
                    <Link to="/login">Already have an account?Login here.</Link>
                </div>
            </div >
        )
    }
}
export default Register;