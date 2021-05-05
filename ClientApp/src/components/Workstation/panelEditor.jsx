'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import '../themes.css';

class PanelEditor extends Component {

    constructor(props) {
        super(props);

        this.state = {
            actions = []
        }
    }

    componentDidMount() {
        this.getResources();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.actions !== this.props.actions) {
            this.updateActions();
        }
    }

    updateActions() {
        let newState = Object.assign({}, this.state);
        newState.actions = [];
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

export default PanelEditor;