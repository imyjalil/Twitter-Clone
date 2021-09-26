import React, {Component} from 'react';
import {Button,Modal} from 'react-bootstrap';
import './imageUploadModal.css'
import API from '../../../axios/api'
import history from '../../../history/history'

class ImageUploadModal extends Component
{
  constructor(props)
  {
    super(props)
    this.state={selectedFile:null}
    this.filePhotoHandler=this.filePhotoHandler.bind(this)
  }

  uploadButtonHandler=()=>{
    if(this.state.selectedFile !== null){
      console.log(this.state.selectedFile)
      const data=new FormData()
      data.append('profileImage',this.state.selectedFile,this.state.selectedFile.name)
      let jsonWebToken=localStorage.getItem('token')

      if(!jsonWebToken){
          return history.push('/logout')
      }

      const options = {
          headers: {'Authorization': 'Bearer '+jsonWebToken}
      }

      API.post('/profile/profile-img-upload',data,options).then((response)=>{
        console.log(response.data)
      })
    }
    this.props.onHide()
  }

  setSelectedFile=(file)=>{
    this.setState({selectedFile:file})
  }

  filePhotoHandler(event){
    var input=event.target
    if(input.files && input.files[0]){
      var reader = new FileReader()
      reader.onload=(e)=>{
        var image = document.getElementById('imagePreview')
        image.src=e.target.result
        this.setSelectedFile(input.files[0])
      }
      reader.readAsDataURL(input.files[0])
    }
  }

  render(){
    return (<Modal
      id="ImageUploadModal"
      {...this.props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      onShow={()=>{console.log('shonw')}}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Upload a new Profile Picture
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input id="filePhoto" type="file" name="filePhoto" onChange={this.filePhotoHandler}/>
        <div className="imagePreviewContainer">
            <img id="imagePreview"/>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this.uploadButtonHandler}>Upload</Button>
        <Button onClick={this.props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>)
  }
}

export default ImageUploadModal