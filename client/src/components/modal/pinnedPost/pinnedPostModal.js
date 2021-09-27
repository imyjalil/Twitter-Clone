import React, {Component} from 'react';
import {Button,Modal} from 'react-bootstrap';
import './pinnedPostModal.css'
import API from '../../../axios/api'
import history from '../../../history/history'

class PinnedPostModal extends Component
{
  constructor(props)
  {
    super(props)
    this.state={}
  }

  pinButtonHandler=()=>{
    let jsonWebToken=localStorage.getItem('token')

      if(!jsonWebToken){
          return history.push('/logout')
      }

      const options = {
          headers: {'Authorization': 'Bearer '+jsonWebToken}
      }
    API.put('/api/posts/'+this.props.postId,{pinned:true},options).then((response)=>{
        console.log(response.data)
    })
    this.props.onHide()
  }

  render(){
    return (<Modal
      id="confirmPinModal"
      {...this.props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      onShow={()=>{console.log('shonw')}}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Pin/Unpin this post?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        This post will appear at the top of your profile. It will stop appearing at the top if you unpin.
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this.pinButtonHandler}>Pin</Button>
        <Button id="pinnedPostModal" onClick={this.props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>)
  }
}

export default PinnedPostModal