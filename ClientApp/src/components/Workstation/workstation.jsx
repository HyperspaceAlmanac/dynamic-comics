import React, { Component } from 'react';

class Workstation extends Component {
    render() {
        return (
            <div>
                <div className="btn btn-primary" onClick={() => this.props.navCallback("main", "")}>Back to Home Page</div>
                <div>
                    Page for creating and editing a comic!
                </div>
            </div>
        );
    }
}

export default Workstation;