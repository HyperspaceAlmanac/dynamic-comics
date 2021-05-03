import React, { Component } from 'react';

class Workstation extends Component {
    constructor(props) {
        super(props);
      }
    render() {
        return (
            <div>
                <div>
                    <div className="btn btn-primary" onClick = {() => this.props.navCallback('main', "")}>Back to Main</div>
                </div>
                <div>
                    Page for creating and editing a comic!
                </div>
            </div>
        );
    }
}

export default Workstation;