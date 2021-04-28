import React, { Component } from 'react';

class Reader extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log(this.props);
        return (
            <div>
                <div>Page for reading through a comic. Specifically for {this.props.comicTitle}</div>
                <div className="btn btn-primary" onClick={() => this.props.navCallback("main")}>Back to Home Page</div>
            </div>
        );
    }
}

export default Reader;