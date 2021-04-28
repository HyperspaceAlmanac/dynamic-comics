import React, { Component } from 'react';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
          someState : "okay"
        }
      }
    render() {
      console.log(this.props);
        return (
          <div>
            Welcome back {this.props.userName}.
          </div>
        );
    }
}

export default Profile;