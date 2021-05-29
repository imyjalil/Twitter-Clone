import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './home.css'

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
            <div className="homeContainer row">
                <nav className="col-2">
                    <Link to="/home"><i className="fa fa-solid fa-dove"></i></Link>
                    <Link to="/search"><i className="fa fa-solid fa-search"></i></Link>
                    <Link to="/notifications"><i className="fa fa-solid fa-bell"></i></Link>
                    <Link to="/messages"><i className="fa fa-solid fa-envelope"></i></Link>
                    <Link to="/profile"><i className="fa fa-solid fa-user"></i></Link>
                    <Link to="/logout"><i className="fa fa-solid fa-sign-out-alt"></i></Link>
                </nav>
                <div className="mainSectionContainer col-10 col-md-8 col-lg-6">
                    <span>Main section</span>
                </div>
                <div className="d-none d-md-block col-md-2 col-lg-4">
                    <span>third column</span>
                </div>
            </div>
        )
    }
}

export default Home;