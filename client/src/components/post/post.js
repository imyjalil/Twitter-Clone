import {Component} from "react";
import history from '../../history/history'
import { createPostHTML } from "../../common/commonUtilities";
import API from '../../axios/api'

class Post extends Component{
    constructor(props){
        super(props)
        this.state={userLoggedIn:props.userLoggedIn}
    }
    render(){
        var postData=null
        var postId=window.location.pathname.split('/')[2]
        var userLoggedIn=this.state.userLoggedIn
        
        if(!postId){
            //handle
        }
        
        let jsonWebToken=localStorage.getItem('token')
        if(!jsonWebToken){
            return history.push('/logout')
        }
        
        const options = {
            headers: {'Authorization': 'Bearer '+jsonWebToken}
        }
        
        let postHTML;
        API.get('/api/posts/'+postId,options).then((response)=>{
            postData=response.data
            postHTML = createPostHTML(postData,userLoggedIn)
        }).catch((error)=>{
            return <div>Error retrieving the post</div>
        })
        return <div className="postsContainer" id="postsContainer">{postHTML}</div>   
    }
}
export default Post