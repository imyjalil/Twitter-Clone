import React, {Component} from 'react';
import {Button,Modal} from 'react-bootstrap';
import './replyModal.css'
import API from '../../axios/api';

class ReplyModal extends Component
{
  constructor(props)
  {
    super(props)
  }

  replyButtonHandler = (postData)=>{
    var textbox=document.getElementById("replyTextarea")
    var data={
      content:textbox.value
    }
    data.replyTo=postData._id
    let jsonWebToken=localStorage.getItem('token')
    if(!jsonWebToken){
        return this.state.history.push('/logout')
    }
    
    const options = {
        headers: {'Authorization': 'Bearer '+jsonWebToken}
      }

    API.post("/api/posts",data,options).then((response)=>{
        if(response && response.data){
            this.props.push('/')//need to modify this to home
        }
    }).catch((error)=>{

    })
  }

  render(){
    return (<Modal
      id="replyModal"
      {...this.props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      onShow={()=>{console.log('shonw')}}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Reply
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {this.props.createPostHTML(this.props.postData)}
      <div className="postFormContainer">
                <div className="userImageContainer">
                    <img src={this.props.userLoggedIn.profilePic} alt="User's profile pic"/>
                </div>
                <div className="textareaContainer">
                    <textarea id="replyTextarea" placeholder="What's happening?" />
                </div>
            </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={()=>{this.replyButtonHandler(this.props.postData)}}>Reply</Button>
        <Button onClick={this.props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>)
  }
}

export default ReplyModal