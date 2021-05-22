import { BrowserRouter } from 'react-router-dom';
import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';


import './App.css';
import Home from './components/home/home';
import Login from './components/login/login';
import Register from './components/register/register';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isAuthenticated: false }
  }
  render() {
    return (
      <BrowserRouter>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        {this.state.isAuthenticated ? <Home /> : <Redirect to="/login" />}
      </BrowserRouter>
    )
  }
}

export default App;
