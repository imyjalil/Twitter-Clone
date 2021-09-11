import React, { Component } from 'react';
import './home.css';
import API from '../../axios/api';
import ReactDOM from 'react-dom';

class Home extends Component {
    constructor(props){
        super(props);
        this.state={userLoggedIn:props.userLoggedIn,history:props.history,posts:null}
    }

    timeDifference=(current, previous)=>{

        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;
    
        var elapsed = current - previous;
    
        if (elapsed < msPerMinute) {
            if(elapsed/1000 < 30) return "Just now"
            return Math.round(elapsed/1000) + ' seconds ago';   
        }
    
        else if (elapsed < msPerHour) {
             return Math.round(elapsed/msPerMinute) + ' minutes ago';   
        }
    
        else if (elapsed < msPerDay ) {
             return Math.round(elapsed/msPerHour ) + ' hours ago';   
        }
    
        else if (elapsed < msPerMonth) {
            return Math.round(elapsed/msPerDay) + ' days ago';   
        }
    
        else if (elapsed < msPerYear) {
            return Math.round(elapsed/msPerMonth) + ' months ago';   
        }
    
        else {
            return Math.round(elapsed/msPerYear ) + ' years ago';   
        }
    }

    createPostHTML=(postData)=>{
        //return postData.content
        if(postData.postedBy._id === undefined){
            return console.log("user object not populated")
        }
        var timestamp=this.timeDifference(new Date(),new Date(postData.createdAt));
        const postHTML=
            <div className='post'>
                <div className='mainContentContainer'>
                    <div className='userImageContainer'>
                        <img src={postData.postedBy.profilePic}/>
                    </div>
                    <div className='postContentContainer'>
                        <div className='header'>
                            <a href={'/profile/'+postData.postedBy.username} className='displayName'>{postData.postedBy.firstName+" "+postData.postedBy.lastName}</a>
                            <span className='username'>@{postData.postedBy.username}</span>
                            <span className='username'>{timestamp}</span>
                        </div>
                        <div className='postBody'>
                            <span>{postData.content}</span>
                        </div>
                        <div className='postFooter'>
                            <div className='postButtonContainer'>
                                <button>
                                    <i className='far fa-comment'></i>
                                </button>
                            </div>
                            <div className='postButtonContainer'>
                                <button>
                                    <i className='fas fa-retweet'></i>
                                </button>
                            </div>
                            <div className='postButtonContainer'>
                                <button>
                                    <i className='far fa-heart'></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
        return postHTML
    }

    postButtonClickHandler=()=>{
        var data={
            content:document.getElementById("postTextarea").value
        }

        let jsonWebToken=localStorage.getItem('token')
        if(!jsonWebToken){
            return this.state.history.push('/logout')
        }
        
        const options = {
            headers: {'Authorization': 'Bearer '+jsonWebToken}
          }

        API.post("/api/posts",data,options).then((response)=>{
            if(response && response.data){
                this.setState(prevState=>({
                    posts:[response.data,...prevState.posts,]
                }))
                document.getElementById("postTextarea").value=""
            }
        }).catch((error)=>{

        })
    }

    componentDidMount(){

        let jsonWebToken=localStorage.getItem('token')
        if(!jsonWebToken){
            return this.state.history.push('/logout')
        }
        
        const options = {
            headers: {'Authorization': 'Bearer '+jsonWebToken}
          }

        API.get("/api/posts",options).then((response)=>{
            this.setState({posts:response.data})
        }).catch((error)=>{

        })
    }

    render() {
        let postForm = (
            <div className="postFormContainer">
                <div className="userImageContainer">
                    <img src={this.state.userLoggedIn.profilePic} alt="User's profile pic"/>
                </div>
                <div className="textareaContainer">
                    <textarea id="postTextarea" placeholder="What's happening?" onKeyUp={(event)=>{
                        var value=event.target.value.trim();
                        var submitButton=document.getElementById("submitPostButton")
                        if(value.length !==0) submitButton.disabled=false
                    }}/>
                    <div className="buttonsContainer">
                        <button id="submitPostButton" onClick={(event)=>{this.postButtonClickHandler()}}>Post</button>
                    </div>
                </div>
            </div>
        )
        return (
            <div>
                {postForm}
                <div className="postsContainer" id="postsContainer">
                    {/*this.state.posts*/}
                    {this.state.posts && this.state.posts.map((post,index)=>this.createPostHTML(post))}
                </div>
            </div>
        )
    }
}

export default Home;