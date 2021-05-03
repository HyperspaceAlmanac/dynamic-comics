'use strict';
import React, { Component } from 'react';

class Tabs extends Component {
    // Buttons and call backs should be defined in props
    constructor(props) {
        super(props);
        this.state = {
          loading : true,
          buttons : this.setupButtons()
        }
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevProps.buttons !== this.props.buttons) {
        //console.log("Comics component did change, updating state");
        let newState = Object.assign({}, this.state);
        newState.buttons = this.setupButtons();
        this.setState(newState);
      }
  }
    setupButtons() {
        let result = [];
        for (let i = 0; i < this.props.buttons.length; i++) {
            let buttonProperties = this.props.buttons[i];
            result.push(<div key={i} className={"btn btn-primary " + buttonProperties.width} onClick={() => buttonProperties.buttonAction()}>{buttonProperties.name}</div>);
        }
        return result;
    }
    
    render() {
      return (
        <div className = "col-12">
            {this.state.buttons}    
        </div>
      );
    }
}

export default Tabs;