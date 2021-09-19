import React, { Component } from 'react';
import './home.css';
import API from '../../axios/api';
import ReplyModal from '../modal/replyModal'
import history from '../../history/history'

class Home extends Component {
    constructor(props){
        super(props);
        this.state={userLoggedIn:props.userLoggedIn,posts:null,showReplyModal:false,postToReply:null}
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
        if(postData==null) return //alert("null post data")

        var isRetweet=postData.retweetData !== undefined
        var retweetedBy=isRetweet?postData.postedBy.username:null;
        postData=isRetweet?postData.retweetData:postData

        if(postData.postedBy._id === undefined){
            return console.log("user object not populated")
        }
        var timestamp=this.timeDifference(new Date(),new Date(postData.createdAt));

        var likeButtonActiveClass=postData.likes.includes(this.state.userLoggedIn._id)?"active":""
        var retweetButtonActiveClass=postData.retweetUsers.includes(this.state.userLoggedIn._id)?"active":""

        var retweetText=''
        if(isRetweet){
            retweetText=<span><i className='fas fa-retweet'></i> Retweeted by <a href={'/profile/'+{retweetedBy}}>@{retweetedBy}</a></span>
        }

        var replyFlag=""
        if(postData.replyTo){
            if(!postData.replyTo._id){
                return alert("id for reply not populated")
            }
            else if(!postData.replyTo.postedBy._id){
                return alert("posted by is not populated")
            }

            var replyToUsername=postData.replyTo.postedBy.username
            replyFlag=(<div className='replyFlag'>
                Replying to <a href={'/profile/'+{replyToUsername}}>@{replyToUsername}</a>
            </div>)
        }

        const postHTML=
            <div className='post'>
                <div className='postActionContainer'>
                    {retweetText}
                </div>
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
                        {replyFlag}
                        <div className='postBody'>
                            <span>{postData.content}</span>
                        </div>
                        <div className='postFooter'>
                            <div className='postButtonContainer'>
                                <button onClick={()=>{this.showReplyModal();this.setState({postToReply:postData})}}>
                                    <i className='far fa-comment'></i>
                                </button>
                            </div>
                            <div className='postButtonContainer green'>
                                <button className={'retweetButton '+retweetButtonActiveClass} onClick={(event)=>{this.retweetButtonClickHandler(postData,event)}}>
                                    <i className='fas fa-retweet'></i>
                                    <span>{postData.retweetUsers.length||""}</span>
                                </button>
                            </div>
                            <div className='postButtonContainer red'>
                                <button className={'likeButton '+likeButtonActiveClass} onClick={(event)=>{this.likeButtonClickHandler(postData,event)}}>
                                    <i className='far fa-heart'></i>
                                    <span>{postData.likes.length||""}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
        return postHTML
    }

    retweetButtonClickHandler=(post,event)=>{
        var button = event.target
        var postId = post._id
        if(postId === undefined) return;
        let jsonWebToken=localStorage.getItem('token')

        if(!jsonWebToken){
            return history.push('/logout')
        }

        const options = {
            headers: {'Authorization': 'Bearer '+jsonWebToken}
        }

        API.post("/api/posts/"+postId+"/retweet",{},options).then((postData)=>{
            console.log(postData)
            button.querySelector("span").innerText=postData.data.retweetUsers.length || ""
            if(postData.data.retweetUsers.includes(this.state.userLoggedIn._id))
                button.classList.add("active")
            else
                button.classList.remove("active")
        }).catch((error)=>{
            console.log(error)
        })
    }

    likeButtonClickHandler=(post,event)=>{
        var button = event.target
        var postId = post._id
        if(postId === undefined) return;
        let jsonWebToken=localStorage.getItem('token')

        if(!jsonWebToken){
            return history.push('/logout')
        }

        const options = {
            headers: {'Authorization': 'Bearer '+jsonWebToken}
        }

        API.put("/api/posts/"+postId+"/like",{},options).then((postData)=>{
            button.querySelector("span").innerText=postData.data.likes.length || ""
            if(postData.data.likes.includes(this.state.userLoggedIn._id))
                button.classList.add("active")
            else
                button.classList.remove("active")
        }).catch((error)=>{
            console.log(error)
        })
    }

    postButtonClickHandler=()=>{
        var data={
            content:document.getElementById("postTextarea").value
        }

        let jsonWebToken=localStorage.getItem('token')
        if(!jsonWebToken){
            return history.push('/logout')
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
            return history.push('/logout')
        }
        
        const options = {
            headers: {'Authorization': 'Bearer '+jsonWebToken}
          }

        API.get("/api/posts",options).then((response)=>{
            this.setState({posts:response.data})
        }).catch((error)=>{

        })
    }

    showReplyModal=()=>{this.setState({showReplyModal:true})}

    hideReplyModal=()=>{this.setState({showReplyModal:false,postToReply:null})}

    render() {
        document.title="Home"
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
                <ReplyModal createPostHTML={this.createPostHTML} userLoggedIn={this.state.userLoggedIn} show={this.state.showReplyModal} onHide={this.hideReplyModal} postData={this.state.postToReply} history={this.props.history}></ReplyModal>
            </div>
        )
    }
}

export default Home;