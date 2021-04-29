import React, { Component } from 'react';

class Donate extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log(this.props);
        return (
            <div>
                <div className="btn btn-primary" onClick={() => this.props.navCallback("main", "")}>Back to Home Page</div>
                <div className="btn btn-primary" onClick={() => this.props.navCallback("profile", this.props.author)}>Back to Artist Profile</div>
                <div>Donation page for a specific Artist: {this.props.author}</div>
            </div>
        );
    }
}

export default Donate;