import React, { Component } from 'react';

class Tabs extends Component {
    // Buttons and call backs should be defined in props
    constructor(props) {
        super(props);
        this.state = {
          loading : true
        }
      }
    render() {
      return (
        <div>
            <div>Placeholder for main page with a lot of comics displayed, popular comics, latest comments</div>
            <div>Main screen page. Welcome back {this.props.userName}</div>
        </div>
      );
    }
}

export default Tabs;