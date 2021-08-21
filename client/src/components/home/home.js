import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import API from '../../axios/api';

class Home extends Component {

    constructor(props) {
        super(props)
        console.log(props)
        this.state = { user: this.props.location.state.user, history:this.props.history}
        console.log(this.state)
        document.title = "Home"
    }

    homeButtonHandler(){

    }

    searchButtonHandler(){

    }

    notificationButtonHandler(){

    }

    messageButtonHandler(){

    }

    profileButtonHandler(){

    }

    logoutButtonHandler(history){
        let token = localStorage.getItem('token')
        if(!token){
            history.push('/login')
        }
        API.get('/logout',{
            headers:{
                'Authorization':'Bearer ' + token
            }
        })
            .then((response)=>{
            console.log(response)
        })
        .catch((error)=>{
            console.log('error:'+error)
        })
        localStorage.removeItem('token')
        history.push('/logout')
    }

    render() {

        const user = this.state.user
        const history = this.state.history
        return (
            <div className="homeContainer row">
                <nav className="col-2">
                    <a onClick={this.homeButtonHandler}><i className="fa fa-solid fa-dove"></i></a>
                    <a onClick={this.searchButtonHandler}><i className="fa fa-solid fa-search"></i></a>
                    <a onClick={this.notificationButtonHandler}><i className="fa fa-solid fa-bell"></i></a>
                    <a onClick={this.messageButtonHandler}><i className="fa fa-solid fa-envelope"></i></a>
                    <a onClick={this.profileButtonHandler}><i className="fa fa-solid fa-user"></i></a>
                    <a onClick={()=>{this.logoutButtonHandler(history)}}><i className="fa fa-solid fa-sign-out-alt"></i></a>
                </nav>
                <div className="mainSectionContainer col-10 col-md-8 col-lg-6">
                    <div className="titleContainer">
                        <h1>{document.title}</h1>
                    </div>
                </div>
                <div className="d-none d-md-block col-md-2 col-lg-4">
                    <span>third column</span>
                </div>
            </div>
        )
    }
}

export default Home;