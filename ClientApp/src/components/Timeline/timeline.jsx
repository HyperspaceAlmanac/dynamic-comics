'use strict';
'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import '../themes.css';

class Timeline extends Component {

    constructor(props) {
        super(props);

        this.state = {
            panels : []
        }
    }

    componentDidMount() {
        let newState = Object.assign({}, this.state);
        newState.panels = this.props.panels;
        this.setState(newState);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.panels !== this.props.panels) {
            this.updatePanels();
        }
    }

    updatePanels() {
        let newState = Object.assign({}, this.state);
        newState.panels = [];
        this.setState(newState);
    }

    render() {
      return (
        <div>
            Timeline
        </div>
      );
    }
}

export default Timeline;