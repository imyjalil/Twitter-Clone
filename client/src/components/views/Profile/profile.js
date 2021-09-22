import { Component } from "react";

class Profile extends Component
{
    componentDidMount()
    {
        console.log('profile component mounted')
    }
    render(){
        document.title="Profile"
        return (
            <div></div>
        )
    }
}

export default Profile