import React, { Component } from 'react';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
          someState : "okay"
        }
      }
    render() {
      return (
        <div>
            <div>Placeholder for main page with a lot of comics displayed, popular comics, latest comments</div>
            <div>Main screen page. State = {this.state.someState}</div>
        </div>
      );
    }
}

export default Main;