import { BrowserRouter } from 'react-router-dom';
import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';


import './App.css';
import Login from './components/login/login';
import Register from './components/register/register';
import Welcome from './components/welcome/welcome'
import Home from './components/home/home'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return (
      <BrowserRouter>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/home" component={Home} />
        <Route path="/" exact component={Welcome} />
      </BrowserRouter>
    )
  }
}

export default App;
