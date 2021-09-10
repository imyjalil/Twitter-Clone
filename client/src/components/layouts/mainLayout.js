import { Component } from "react";
import './mainLayout.css';
import API from '../../axios/api'
import {HOME,SEARCH,MESSAGES,NOTIFICATIONS,PROFILE} from '../../constants'
import Messages from "../views/Messages/messages";
import Notifications from "../views/Notifications/notifications";
import Profile from "../views/Profile/profile";
import Search from "../views/Search/search";
import Home from "../home/home"

class MainLayout extends Component
{
    constructor(props) {
        super(props)
        console.log(props)
        this.state = { 
            user: props.location && props.location.state && props.location.state.user?props.location.state.user: null, 
            history:props.history?props.history:null,
            view:HOME
        }
        document.title = "Home"
    }

    homeButtonHandler=()=>{
        this.setState({view:HOME})
        document.title = "Home"
    }

    searchButtonHandler=()=>{
        this.setState({view:SEARCH})
        document.title = "Search"
    }

    notificationButtonHandler=()=>{
        this.setState({view:NOTIFICATIONS})
        document.title = "Notifications"
    }

    messageButtonHandler=()=>{
        this.setState({view:MESSAGES})
        document.title = "Messages"
    }

    profileButtonHandler=()=>{
        this.setState({view:PROFILE})
        document.title = "Profile"
    }

    logoutButtonHandler=(history)=>{
        document.title = "Twitter"
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

    render()
    {
        const user = this.state.user
        const history = this.state.history

        let viewToRender=null
        switch(this.state.view){
            case HOME:
                viewToRender=<Home/>
                break;

            case SEARCH:
                viewToRender=<Search/>
                break;
            
            case NOTIFICATIONS:
                viewToRender=<Notifications/>
                break;

            case MESSAGES:
                viewToRender=<Messages/>
                break;

            case Profile:
                viewToRender=<Profile/>
                break;
        }

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
                    {viewToRender}
                </div>
                <div className="d-none d-md-block col-md-2 col-lg-4">
                    <span>third column</span>
                </div>
            </div>
        )
    }
}

export default MainLayout