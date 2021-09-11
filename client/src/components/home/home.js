import React, { Component } from 'react';
import './home.css';
import API from '../../axios/api';

class Home extends Component {
    constructor(props){
        super(props);
        this.state={userLoggedIn:props.userLoggedIn,history:props.history,posts:null}
    }

    createPostHTML=(postData)=>{
        //return postData.content
        if(postData.postedBy._id === undefined){
            return console.log("user object not populated")
        }
        var timestamp=postData.createdAt;
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

    renderPostHtml=(html,container)=>{
        console.log('html:')
        console.log(html)
        if(this.state.posts){
            this.setState(prevState=>{
                // let newPosts=Object.assign({},prevState.posts)
                // newPosts=newPosts+html
                // console.log(newPosts)
                // return {newPosts}
                // posts:{
                //     ...prevState.posts+html
                // }
                let newPosts={...prevState.posts}
                newPosts=newPosts.concat(html)
                console.log('newPosts:')
                console.log(newPosts)
                return {newPosts}
            })
        }
        else this.setState({posts:html})
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
                this.renderPostHtml(html,document.getElementById("postsContainer"))
                document.getElementById("postTextarea").value=""
            }
        }).catch((error)=>{

        })
    }

    outputPosts=(results, container)=>{
        results.forEach((result)=>{
            var html=this.createPostHTML(result)
            this.renderPostHtml(html,document.getElementById("postsContainer"))
        })

        if(results.length===0){
            container.append('<span class="noResults">Nothing to show.</span>')
        }
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
            this.outputPosts(response.data,document.getElementById("postsContainer"))
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
                    {this.state.posts}
                </div>
            </div>
        )
    }
}

export default Home;