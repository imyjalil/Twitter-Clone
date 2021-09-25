import { Component } from "react";
import API from '../../../axios/api'
import history from '../../../history/history'
import './profile.css'
import {Link} from 'react-router-dom';
import {createTab,createPostHTML} from '../../../common/commonUtilities'

class Profile extends Component
{
    constructor(props){
        super(props)
        this.state={userLoggedIn:null,profileUser:null,posts:null,repliesTab:false,selectedTab:"Posts"};
    }
    
    componentDidMount()
    {
        console.log('profile mounted')
        var urlList=window.location.pathname.split('/')
        var username=urlList.length===2?this.props.userLoggedIn.username:urlList[2]
        console.log(username)
        
        let jsonWebToken=localStorage.getItem('token')

        if(!jsonWebToken){
            return history.push('/logout')
        }

        const options = {
            headers: {'Authorization': 'Bearer '+jsonWebToken}
        }

        var profileUser=null

        API.get('/profile/'+username,options).then((response)=>{
            console.log("profile response:")
            console.log(response.data)
            
            if(response.data.errorMessage)
            {
                profileUser=null
                this.setState({profileUser:null,userLoggedIn:response.data.userLoggedIn})
            }
            else{
                profileUser=response.data.profileUser
                this.setPosts(profileUser)
                this.setState({profileUser:response.data.profileUser,userLoggedIn:response.data.userLoggedIn})
            }

            
        }).catch((error)=>{
            console.log(error)
        })

        
    }

    setTab=(tab)=>{
        this.setState({selectedTab:tab})
    }

    setPosts=(profileUser)=>{
        var params=null
        profileUser =this.state.profileUser?this.state.profileUser:profileUser
        
        var waitTill = new Date(new Date().getTime() + 500);
        while(waitTill > new Date()){}

        let jsonWebToken=localStorage.getItem('token')

        if(!jsonWebToken){
            return history.push('/logout')
        }

        
        if(profileUser && this.state.selectedTab=="Posts"){
            params={postedBy:profileUser._id,isReply:false}
        }
        else if(profileUser){
            params={postedBy:profileUser._id,isReply:true}
        }
        if(profileUser){
            API.get('/api/posts/',{
                params:params,
                headers: {'Authorization': 'Bearer '+jsonWebToken}
            }).then((response)=>{
                this.setState({posts:response.data})
            })
        }
    }

    createFollowButton(user, isFollowing){
        var text =isFollowing?"Following":"Follow"
        var buttonClass=isFollowing?"followButton following":"followButton"
        return (<button className={buttonClass} >{text}</button>)
    }

    render(){
        document.title="Profile"
        if(!this.state.profileUser)
        {
            return (<div>
                User Not Found
            </div>)
        }
        var profileUser=this.state.profileUser
        var userLoggedIn=this.state.userLoggedIn
        var isFollowing=false
        
        return (
            <div>
                <div className="profileHeaderContainer">
                    <div className="coverPhotoContainer">
                        <div className="userImageContainer">
                            <img src={profileUser.profilePic} alt="User's profile image"/>
                        </div>
                    </div>
                    <div className="profileButtonsContainer">
                        {profileUser && userLoggedIn && profileUser._id != userLoggedIn._id?
                        <Link to={"/messages/"+profileUser._id} className="profileButton">
                            <i className="fas fa-envelope" aria-hidden="true"/>
                        </Link>:null}
                        {profileUser && userLoggedIn && profileUser._id != userLoggedIn._id?
                        this.createFollowButton(profileUser,isFollowing):null}
                    </div>
                    <div className="userDetailsContainer">
                        <span className="displayName">{profileUser.firstName} {profileUser.lastName}</span>
                        <span className="username">@{profileUser.username}</span>
                        <span className="description">{profileUser.description}</span>
                        <div className="followersContainer">
                            <Link to={"/profile/"+profileUser.username+"/following"}>
                                <span className="value">0</span>
                                <span> Following</span>
                            </Link>
                            <Link to={"/profile/"+profileUser.username+"/followers"}>
                                <span className="value">0</span>
                                <span> Followers</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="tabsContainer">
                    {createTab("Posts","/profile/"+profileUser.username,this.state.selectedTab==="Posts", this.setTab,this.setPosts, this.state.profileUser)}
                    {createTab("Replies","/profile/"+profileUser.username+"/replies",this.state.selectedTab==="Replies", this.setTab,this.setPosts, this.state.profileUser)}
                </div>
                <div className="postsContainer">
                    {this.state.posts && this.state.posts.map((post,index)=>createPostHTML(post,userLoggedIn,null,null,null,null,null,null,null,null,index))}
                    {!this.state.posts && "Nothing to show"}
                </div>
            </div>
        )
    }
}

export default Profile