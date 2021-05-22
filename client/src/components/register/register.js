import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';

class Register extends Component {
    constructor(props) {
        super(props);
        document.title = "Register"
    }

    validatePassword() {
        var passwordField = document.getElementById("password")
        var passwordConfField = document.getElementById("passwordConf")
        if (passwordField.value != passwordConfField.value) {
            ReactDOM.render('Passwords do not match', document.getElementById('passwordInc'))
        }
        else {
            ReactDOM.render(null, document.getElementById('passwordInc'))
        }
    }

    submitHandler() {

    }

    render() {
        return (
            <div className="wrapper">
                <div className="loginContainer">
                    <h1>Register</h1>
                    <form>

                        <input type="text" name="firstName" placeholder="First Name" required></input>
                        <input type="text" name="lastName" placeholder="Last Name" required></input>
                        <input type="text" name="username" placeholder="Username" required></input>
                        <input type="email" name="email" placeholder="Email" required></input>
                        <input id="password" type="password" name="password" placeholder="Password" required></input>
                        <input id="passwordConf" type="password" name="passwordConf" placeholder="Confirm Password" required onChange={this.validatePassword}></input>
                        <div id="passwordInc"></div>
                        <input type="submit" value="Login" onClick={this.submitHandler} />
                    </form>
                    <Link to="/login">Already have an account?Login here.</Link>
                </div>
            </div>
        )
    }
}
export default Register;