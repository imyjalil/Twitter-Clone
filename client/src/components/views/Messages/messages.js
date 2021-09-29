import { Component } from "react";
import history from '../../../history/history'
import {MESSAGES} from '../../../constants'
import './messages.css'

class Messages extends Component
{
    constructor(props){
        super(props)
        this.state={showNewMessageView:false};
    }

    componentDidMount(){
        console.log('messages rendered')
    }

    newMessageButtonHandler=()=>{
        this.setState({showNewMessageView:true})
    }

    render(){
        document.title="Messages"
        var newMessageView=(
            <div className="chatPageContainer">
                <div className="chatTitleBar">
                    <label for="userSearchTextbox">To:</label>
                    <div id="selectedUsers">
                        <input id="userSearchTextbox" type="text" placeholder="Type the name of the person" />
                    </div>
                </div>
                <div className="resultsContainer">
                </div>
                <button id="createChatButton" disabled="disabled">Create Chat</button>
            </div>)
        return (
            <div className="messageContainer">
                {this.state.showNewMessageView?newMessageView:(<div><div className="newMessageButton">
                    <a onClick={this.newMessageButtonHandler}><i className="far fa-plus-square"/></a>
                </div>
                <div className="resultsContainer">

                </div></div>)}
            </div>
        )
    }
}

export default Messages