import React, { Component } from 'react';
import { Route,Switch,Router } from 'react-router-dom';
import './App.css';
import Login from './components/login/login';
import Register from './components/register/register'
import MainLayout from './components/layouts/mainLayout'
import {createBrowserHistory} from 'history'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {user:null}
  }
  setLoggedinUser=(userLoggedIn)=>{
    this.setState({user:userLoggedIn})
  }
  render() {
    const history=createBrowserHistory()
    return (
      <div>
        {this.state.user && <MainLayout {...this.props} setLoggedinUser={this.setLoggedinUser} userLoggedIn={this.state.user}/>}
        {console.log("user:")}
        {console.log(this.state.user)}
        <Switch>
          <Route path="/logout" render={(props)=><Login {...props} setLoggedinUser={this.setLoggedinUser}/>} />
          <Route path="/login" render={(props)=><Login {...props} setLoggedinUser={this.setLoggedinUser}/>} />
          <Route path="/register" render ={()=><Register/>}/>
          {!this.state.user && <Route render={(props)=><Login {...props} setLoggedinUser={this.setLoggedinUser}/>} />}
        </Switch>
        </div>
    )
  }
}

export default App;
