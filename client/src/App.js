import { BrowserRouter } from 'react-router-dom';
import React, { Component } from 'react';
import { Route,Switch } from 'react-router-dom';
import './App.css';
import Login from './components/login/login';
import Register from './components/register/register';
import Welcome from './components/welcome/welcome'
import Home from './components/home/home'
import MainLayout from './components/layouts/mainLayout'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return (
      <BrowserRouter>
        <Switch>
        <Route path="/logout" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/" exact component={Welcome} />
        <Route render={(props) => <MainLayout {...props} />} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App;
