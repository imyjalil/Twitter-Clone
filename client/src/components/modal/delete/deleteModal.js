import React, {Component} from 'react';
import {Button,Modal} from 'react-bootstrap';
import './deleteModal.css'
import API from '../../../axios/api';
import history from '../../../history/history'

class DeleteModal extends Component
{
  constructor(props)
  {
    super(props)
  }

  deleteButtonHandler = ()=>{
    var postId=this.props.postId
    if(postId === undefined){
      return this.props.onHide()
    }
    let jsonWebToken=localStorage.getItem('token')

    if(!jsonWebToken){
        return history.push('/logout')
    }

    const options = {
        headers: {'Authorization': 'Bearer '+jsonWebToken}
    }
    API.delete("/api/posts/"+postId,options).then((response)=>{
      window.location.reload()
    })
  }

  render(){
    return (<Modal
      id="deletePostModal"
      {...this.props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      onShow={()=>{console.log('shonw')}}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Delete the post?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>You won't be able to undo this</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this.deleteButtonHandler}>Delete</Button>
        <Button onClick={this.props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>)
  }
}

export default DeleteModal