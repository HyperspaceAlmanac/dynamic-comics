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
            let newState = Object.assign({}, this.state);
            newState.panels = this.props.panels;
            this.setState(newState);
        }
    }

    addPanel() {
        let newState = Object.assign({}, this.state);
        newState.panels.push({id: 0, number: newState.panels.length, start: false, active : false, actions : []});
        this.setState(newState);
    }

    panelsList() {
        let result = [];
        let i;
        let options;
        let active = this.props.panel ? this.props.panel.id : -1;
        for (i = 0; i < this.state.panels.length; i++) {
            let id = this.state.panels[i].id;
            options = this.state.panels[i].id === active?
                (`col-11 ${this.props.theme}-btn-one ${this.props.theme}-font-color` + " btn")
                : (`col-11 ${this.props.theme}-btn-two ${this.props.theme}-font-color2` + " btn");
            result.push(<div key={i} className = {options} onClick = {() => this.props.visitPanel(id)}>
                {"Id: " + this.state.panels[i].id + ", Number: "
                  + this.state.panels[i].number + (this.state.panels[i].active ? ", Active" : ", Hidden")}
                </div>)
        }
        return result;
    }

    cancelNewEntries() {
        let newState = Object.assign({}, this.state);
        newState.panels = this.state.panels.filter(p => p.id !== 0);
        this.setState(newState);
    }

    saveChanges() {
        this.pushPanels();
    }

    render() {
      return (
        <div>
            <div className="row">
                <div className={`col-4 ${this.props.theme}-btn-two ${this.props.theme}-font-color2` + " btn"}
                    onClick = {() => this.addPanel()}>Add</div>
                <div className={`col-4 ${this.props.theme}-btn-two ${this.props.theme}-font-color2` + " btn"}
                    onClick = {() => this.saveChanges()}>Save</div>
                <div className={`col-4 ${this.props.theme}-btn-two ${this.props.theme}-font-color2` + " btn"}
                    onClick = {() => this.cancelNewEntries()}>Cancel</div>
            </div>
            <br/>
            <div className="row">
                {this.panelsList()}
            </div>
        </div>
      );
    }

    async pushPanels() {
        const token = await authService.getAccessToken();
        let requestParam = this.props.showProgress ? "history" : "partial";
        const requestOptions = {
            method: 'Put',
            headers: {'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
            body: JSON.stringify({ comicName : this.props.comicName, panels : this.state.panels})
        }
        // In case user continues typing and it becomes something different
        const response = await fetch('api/Account/UpdatePanels', requestOptions);
        const data = await response.json();
        if (data.result === "Success") {
            this.props.workStationCallBack(data);
        }
    }
}

export default TimelineEditor;