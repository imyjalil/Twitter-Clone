import React, { Component } from 'react';
import './home.css';
import API from '../../axios/api';
import ReplyModal from '../modal/reply/replyModal'
import DeleteModal from '../modal/delete/deleteModal';
import PinnedPostModal from '../modal/pinnedPost/pinnedPostModal';
import history from '../../history/history'
import {POST} from '../../constants'
import {createPostHTML} from '../../common/commonUtilities'

class Home extends Component {
    constructor(props){
        super(props);
        this.state={userLoggedIn:props.userLoggedIn,posts:null,showReplyModal:false,postToReply:null,showDeleteModal:false,postIdToDelete:null,pinnedPostModal:false,pinnedPostId:null}
    }

    postClickHandler=(postData,event)=>{
        if(event.target.tagName ===  "BUTTON" || event.target.tagName==='A') return
        var postId=postData._id
        if(postId !== undefined)
        {
            this.props.history.push('/post/'+postId)
            this.props.setView(POST)
        }
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
            params:{followingOnly:true},
            headers: {'Authorization': 'Bearer '+jsonWebToken}
          }

        API.get("/api/posts",options).then((response)=>{
            this.setState({posts:response.data})
        }).catch((error)=>{

        })
    }

    showReplyModal=()=>{this.setState({showReplyModal:true})}

    hideReplyModal=()=>{this.setState({showReplyModal:false,postToReply:null})}

    showDeleteModal=()=>{this.setState({showDeleteModal:true})}

    hideDeleteModal=()=>{this.setState({showDeleteModal:false,postIdToDelete:null})}

    setPostToReply=(postData)=>{this.setState({postToReply:postData})}

    setPostToDelete=(postId)=>{this.setState({postIdToDelete:postId})}

    showPinnedPostModal=()=>{
        this.setState({pinnedPostModal:true})
    }

    hidePinnedPostModal=()=>{
        this.setState({pinnedPostModal:false})
    }

    setPostToPin=(postId)=>{
        this.setState({pinnedPostId:postId})
    }

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
                    {this.state.posts && this.state.posts.map((post,index)=>createPostHTML(post,this.state.userLoggedIn,this.postClickHandler,this.showReplyModal,this.showDeleteModal,this.setPostToReply,this.retweetButtonClickHandler,this.likeButtonClickHandler,this.setPostToDelete,this.props.setView,this.showPinnedPostModal,this.setPostToPin,index))}
                </div>
                <ReplyModal createPostHTML={createPostHTML} userLoggedIn={this.state.userLoggedIn} show={this.state.showReplyModal} onHide={this.hideReplyModal} postData={this.state.postToReply} history={this.props.history}></ReplyModal>
                <DeleteModal show={this.state.showDeleteModal} onHide={this.hideDeleteModal} postId={this.state.postIdToDelete} setPostToDelete={this.setPostToDelete}/>
                <PinnedPostModal show={this.state.pinnedPostModal} onHide={this.hidePinnedPostModal} postId={this.state.pinnedPostId}/>
            </div>
        )
    }
}

export default Home;