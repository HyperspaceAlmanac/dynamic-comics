'use strict';
import React, { Component } from 'react';
import '../themes.css';

class Timeline extends Component {

    constructor(props) {
        super(props);

        this.state = {
            panels : this.props.panels
        }
    }

    ccomponentDidMount() {
        let newState = Object.assign({}, this.state);
        newState.panels = this.props.panels;
        console.log("In did mount");
        console.log(newState);
        this.setState(newState);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.panels !== this.props.panels ||
            prevProps.panel !== this.props.panel) {
            let newState = Object.assign({}, this.state);
            newState.panels = this.props.panels;
            console.log("In component update");
            console.log(newState);
            this.setState(newState);
        }
    }

    panelsList() {
        let result = [];
        let i;
        let options;
        let active = this.props.panel ? this.props.panel.id : -1;
        for (i = 0; i < this.state.panels.length; i++) {
            /** */
            let id = this.state.panels[i].id;
            options = this.state.panels[i].id === active ?
                (`col-11 ${this.props.theme}-btn-one ${this.props.theme}-font-color` + " btn")
                : (`col-11 ${this.props.theme}-btn-two ${this.props.theme}-font-color2` + " btn"); 
            if (this.state.panels[i].active) {
                result.push(<div key={i} className = {options} onClick = {() => this.props.goToPanel(id)}>
                    {"Panel Number: " + this.state.panels[i].number}
                    </div>)
            }
        }
        console.log(result.length);
        return result;
    }

    render() {
        console.log("Inside of timeline");
        console.log(this.state);
        console.log(this.props);
        return (
          <div>
              <div>Timeline</div>
              <div className="row">
                  {this.panelsList()}
              </div>
          </div>
        );
      }
}

export default Timeline;