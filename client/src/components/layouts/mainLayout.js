import { Component } from "react";
import './mainLayout.css';
import API from '../../axios/api'
import {HOME,SEARCH,MESSAGES,NOTIFICATIONS,PROFILE} from '../../constants'
import Messages from "../views/Messages/messages";
import Notifications from "../views/Notifications/notifications";
import Profile from "../views/Profile/profile";
import Search from "../views/Search/search";
import Home from "../home/home"
import history from '../../history/history'

class MainLayout extends Component
{
    constructor(props) {
        super(props)
        
        this.state = { 
            user: props.userLoggedIn?props.userLoggedIn:null
        }
        if(!this.state.user) history.push('/logout')
    }
    componentDidMount(){
        this.setState({view:this.props.view?this.props.view:HOME})
    }
    homeButtonHandler=()=>{
        history.push('/home')
        this.setState({view:HOME})
    }

    searchButtonHandler=()=>{
        history.push('/search')
        this.setState({view:SEARCH})
    }

    notificationButtonHandler=()=>{
        history.push('/notifications')
        this.setState({view:NOTIFICATIONS})

    }

    messageButtonHandler=()=>{
        history.push('/messages')
        this.setState({view:MESSAGES})
    }

    profileButtonHandler=()=>{
        history.push('/profile')
        this.setState({view:PROFILE})
    }

    logoutButtonHandler=(history)=>{
        document.title = "Twitter"
        let token = localStorage.getItem('token')
        if(!token){
            this.props.setLoggedinUser(null)
            history.push('/login')
        }
        API.get('/logout',{
            headers:{
                'Authorization':'Bearer ' + token
            }
        })
            .then((response)=>{
                this.props.setLoggedinUser(null)
                localStorage.removeItem('token')
                history.push('/logout')
                console.log(response)
        })
        .catch((error)=>{
            console.log('error:'+error)
        })
        
    }

    renderPageTitle=()=>{
        switch(this.state.view){
            case HOME:
                return 'Home'

            case SEARCH:
                return 'Search'
            
            case NOTIFICATIONS:
                return 'Notifications'

            case MESSAGES:
                return 'Messages'

            case PROFILE:
                return 'Profile'
        }

    }

    render()
    {
        const user = this.state.user

        let viewToRender=null
        switch(this.state.view){
            case HOME:
                viewToRender=<Home userLoggedIn={user} history={history}/>
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

            case PROFILE:
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
                        <h1>{this.renderPageTitle()}</h1>
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