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
    setupButtons() {
        let result = [];
        for (let i = 0; i < this.props.buttons.length; i++) {
            let buttonProperties = this.props.buttons[i];
            result.push(<div key={i} className={"btn btn-primary " + buttonProperties.width} onClick={() => buttonProperties.buttonAction()}>{buttonProperties.name}</div>);
        }
        return result;
    }
    
    render() {
        console.log("In Tabs render");
        console.log(this.state.buttons);
      return (
        <div className = "col-12">
            {this.state.buttons}    
        </div>
      );
    }
}

export default Tabs;