'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import ActionEdit from './actionEdit';
import '../themes.css';

class PanelEditor extends Component {

    constructor(props) {
        super(props);

        this.state = {
            actions : []
        }
    }

    componentDidMount() {
        let newState = Object.assign({}, this.state);
        newState.actions = this.props.actions;
        this.setState(newState);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.actions !== this.props.actions) {
            this.updateActions();
        }
    }

    UpdateEntry(index, key, value) {
        let newState = Object.assign({}, this.state);
        newState.actions[index][key] = value;
        this.setState(newState);
    }

    generateActionEdits() {
        let values = [];
        for (let i = 0; i < this.state.actions.length; i++) {
            values.push(<ActionEdit key={i} actionObj = {this.state.actions[i]} updateAction = {(i, key, value) => this.UpdateEntry(key, value)}/>)
        }
        return values;
    }

    updateActions() {
        let newState = Object.assign({}, this.state);
        newState.actions = [];
        this.setState(newState);
    }

    addPanel() {

    }
    
    render() {
      return (
        <div>
            <div>
                Panels Editor
            </div>
            <div>
                {"Panel ID: " + this.props.panelId}
            </div>
            <div>
                Need to pass in Panel Number
            </div>
        </div>
      );
    }

    async updateActions() {
        const token = await authService.getAccessToken();
        let requestParam = this.props.showProgress ? "history" : "partial";
        const requestOptions = {
            method: 'Put',
            headers: {'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
            body: JSON.stringify({ panelId : this.props.panelId, })
        }
        // In case user continues typing and it becomes something different
        //const response = await fetch('api/Account/GetComics', requestOptions);
        //const data = await response.json();
        
             
    }
}

export default PanelEditor;