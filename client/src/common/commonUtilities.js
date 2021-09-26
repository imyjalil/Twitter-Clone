import {Link} from 'react-router-dom'
import {PROFILE} from '../constants'
import API from '../axios/api'
import history from '../history/history'

let timeDifference=(current, previous)=>{

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

export function createPostHTML(postData,userLoggedIn,postClickHandler,showReplyModal,showDeleteModal,setPostToReply,retweetButtonClickHandler,likeButtonClickHandler,setPostToDelete,setView,index){
    //return postData.content
    if(postData==null) return //alert("null post data")

    var isRetweet=postData.retweetData !== undefined
    var retweetedBy=isRetweet?postData.postedBy.username:null;
    postData=isRetweet?postData.retweetData:postData

    if(postData.postedBy._id === undefined){
        return console.log("user object not populated")
    }
    var timestamp=timeDifference(new Date(),new Date(postData.createdAt));

    var likeButtonActiveClass=postData.likes.includes(userLoggedIn._id)?"active":""
    var retweetButtonActiveClass=postData.retweetUsers.includes(userLoggedIn._id)?"active":""

    var retweetText=''
    if(isRetweet){
        retweetText=<span><i className='fas fa-retweet'></i> Retweeted by <Link to={'/profile/'+retweetedBy} onClick={()=>{setView(PROFILE)}}>@{retweetedBy}</Link></span>
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
            Replying to <Link to={'/profile/'+replyToUsername} onClick={()=>{setView(PROFILE)}}>@{replyToUsername}</Link>
        </div>)
    }
    var buttons="";
    
    if(postData.postedBy._id==userLoggedIn._id){
        buttons=(<button id={postData._id} onClick={(event)=>{showDeleteModal();setPostToDelete(event.target.id);}} data-id={postData._id}><i className="fas fa-times"></i></button>)
    }
    
    const postHTML=
        <div key={index} className='post' onClick={postClickHandler?(event)=>{postClickHandler(postData,event)}:undefined}>
            <div className='postActionContainer'>
                {retweetText}
            </div>
            <div className='mainContentContainer'>
                <div className='userImageContainer'>
                    <img src={postData.postedBy.profilePic}/>
                </div>
                <div className='postContentContainer'>
                    <div className='header'>
                        <Link to={'/profile/'+postData.postedBy.username} className='displayName' onClick={()=>{setView(PROFILE)}}>{postData.postedBy.firstName+" "+postData.postedBy.lastName}</Link>
                        <span className='username'>@{postData.postedBy.username}</span>
                        <span className='date'>{timestamp}</span>
                        {buttons}
                    </div>
                    {replyFlag}
                    <div className='postBody'>
                        <span>{postData.content}</span>
                    </div>
                    <div className='postFooter'>
                        <div className='postButtonContainer'>
                            <button onClick={()=>{showReplyModal();setPostToReply(postData)}}>
                                <i className='far fa-comment'></i>
                            </button>
                        </div>
                        <div className='postButtonContainer green'>
                            <button className={'retweetButton '+retweetButtonActiveClass} onClick={(event)=>{retweetButtonClickHandler(postData,event)}}>
                                <i className='fas fa-retweet'></i>
                                <span>{postData.retweetUsers.length||""}</span>
                            </button>
                        </div>
                        <div className='postButtonContainer red'>
                            <button className={'likeButton '+likeButtonActiveClass} onClick={(event)=>{likeButtonClickHandler(postData,event)}}>
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

export function createTab(name, href, isSelected, tabHandler, setPosts, profileUser){
    var className=isSelected?"tab active":"tab"
    return (<Link to={href} className={className} onClick={()=>{tabHandler(name);setPosts(profileUser);}}>
        <span>{name}</span>
    </Link>)
}

export function getAuthorizationHeader()
{
    let jsonWebToken=localStorage.getItem('token')

    if(!jsonWebToken){
        return history.push('/logout')
    }

    const options = {
        headers: {'Authorization': 'Bearer '+jsonWebToken}
    }

    return options
}

export function createFollowButton(user, isFollowing){
    var text =isFollowing?"Following":"Follow"
    var buttonClass=isFollowing?"followButton following":"followButton"
    return (<button className={buttonClass} onClick={(event)=>{
        var userId=user._id
        var options=getAuthorizationHeader()
        API.put('/api/users/'+userId+'/follow',{},options).then((response)=>{
            if(response.status==404){
                //handle not found
                return
            }
            var button =event.target
            var data=response.data
            var difference=1
            if(data.following && data.following.includes(userId)){
                button.classList.add("following")
                button.textContent="Following"
            }
            else{
                button.classList.remove("following")
                button.textContent="Follow"
                difference=-1
            }
            var followersLabel=document.getElementById("followersValue")
            if(followersLabel.length!=0){
                //followersLabel.text="hi"
                followersLabel.textContent=parseInt(followersLabel.textContent)+difference
            }
        })
    }}>{text}</button>)
}