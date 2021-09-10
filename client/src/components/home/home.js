import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import API from '../../axios/api';

class Home extends Component {
    constructor(props){
        super(props);
        this.state={userLoggedIn:props.userLoggedIn}
    }

    postButtonClickHandler=()=>{
        var data={
            coontent:document.getElementById("postTextarea").value
        }
        API.post("/api/posts").then((response)=>{
            if(response && response.data){

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
                {postForm}
            </div>
        )
    }
}

export default Home;