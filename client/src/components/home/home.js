import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import API from '../../axios/api';
import ReactHtmlParser from 'react-html-parser'
import ReactDOM from 'react-dom';

class Home extends Component {
    constructor(props){
        super(props);
        this.state={userLoggedIn:props.userLoggedIn,history:props.history}
    }

    createPostHTML=(postData)=>{
        //return postData.content
        var timestamp=postData.createdAt;
        console.log(postData)
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

    renderPostHtml=(html)=>{
        let prevHtml=document.getElementById("postsContainer").innerHTML
        ReactDOM.render(html,document.getElementById('postsContainer'))
        document.getElementById("postsContainer").innerHTML+=prevHtml
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
                var html=this.createPostHTML(response.data)
                this.renderPostHtml(html)
                document.getElementById("postTextarea").value=""
            }
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
                {}
                {postForm}
                <div className="postsContainer" id="postsContainer">
                    
                </div>
            </div>
        )
    }
}

export default Home;