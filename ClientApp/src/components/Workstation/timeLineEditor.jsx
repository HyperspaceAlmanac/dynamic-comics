'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import '../themes.css';

class TimeLineEditor extends Component {

    constructor(props) {
        super(props);

        this.state = {
            panels = []
        }
    }

    componentDidMount() {
        this.getResources();
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
            Panels Editor
        </div>
      );
    }
}

export default TimelineEditor;