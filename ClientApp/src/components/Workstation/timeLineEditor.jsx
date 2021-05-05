'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import '../themes.css';

class TimelineEditor extends Component {

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

    addPanel() {
        let newState = Object.assign({}, this.state);
        newState.panels = [];
        this.setState(newState);
    }

    saveChanges() {
        this.pushPanels();
        this.props.updateAll();
    }

    render() {
      return (
        <div>
            Timeline of Panels
        </div>
      );
    }

    async pushPanels() {
        const token = await authService.getAccessToken();
        let requestParam = this.props.showProgress ? "history" : "partial";
        const requestOptions = {
            method: 'Put',
            headers: {'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
            body: JSON.stringify({ panelList : this.state.panels})
        }
        // In case user continues typing and it becomes something different
        //const response = await fetch('api/Account/GetComics', requestOptions);
        //const data = await response.json();
        
             
    }
}

export default TimelineEditor;