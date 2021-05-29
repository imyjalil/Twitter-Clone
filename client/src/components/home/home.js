import React, { Component } from 'react';


class Home extends Component {
    constructor(props) {
        super(props)
        this.state = { user: this.props.location.state.user }
    }

    componentDidMount() {

    }

    render() {

        const user = this.state.user
        return (
            <div>
                welcome {user.firstName + " " + user.lastName}
            </div>
        )
    }
}

export default Home;