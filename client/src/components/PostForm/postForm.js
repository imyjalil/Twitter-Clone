import React, { Component } from 'react';

class PostForm extends Component{
    constructor(props){
        super(props)
        this.state={userLoggedIn:props.user}
    }
    render(){
        return (
            <div className="postFormContainer">
                <div className="userImageContainer">
                    <img src={userLoggedIn.profilePic} alt="User's profile pic">

                    </img>
                </div>
            </div>
        )
    }
}