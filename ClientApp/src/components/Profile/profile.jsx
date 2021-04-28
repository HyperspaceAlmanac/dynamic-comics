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
      if (!this.props.registered) {
        return (
          <div>
            Please complete registration!
          </div>
        );
      } else {
        return (
          <div>
            Profile Page. Either artist's own page, or another user's page.
          </div>
        );
      }
    }
}

export default Profile;