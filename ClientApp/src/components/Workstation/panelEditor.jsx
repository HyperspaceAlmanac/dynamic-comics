'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import ActionEdit from './actionEdit';
import '../themes.css';

class PanelEditor extends Component {

    constructor(props) {
        super(props);

        this.state = {
            file : null,
            actions : this.props.panel.actions,
            panelNum : this.props.panel.number,
            active : this.props.panel.active
        }
        this.fileUpdate = this.fileUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    fileUpdate(event) {
        let newState = Object.assign({}, this.state);
        newState.file = event.target.files[0];
        this.setState(newState);
    }

    handleImageSubmit() {
        if (this.state.file !== null &&
            (this.state.file.name.endsWith(".png")
            || this.state.file.ame.endsWith(".jpg"))) {
            this.postResource();
        } else {
            alert("Please Only Upload PNG or JPEG");
        }
    }

    handleChange(event) {
        let value = 0;
        if (event.target.value === "") {
            value = 0;
        } else {
            value = parseInt(event.target.value);
        }
        if (isNaN(value) || value < 0) {
            alert("Panel Number needs to be a positive integer!");
        } else {
            let newState = Object.assign({}, this.state);
            newState[event.target.name] =  value;
            this.setState(newState);
        }
    }

    componentDidMount() {
        let newState = Object.assign({}, this.state);
        newState.actions = this.props.panel.actions;
        newState.panelNum = this.props.panel ? this.props.panel.number : 0;
        newState.active = this.props.panel.active
        this.setState(newState);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.panel !== this.props.panel) {
            let newState = Object.assign({}, this.state);
            newState.actions = this.props.panel.actions;
            newState.panelNum = this.props.panel ? this.props.panel.number : 0;
            newState.active = this.props.panel.active
            this.setState(newState);
        }
    }

    UpdateEntry(index, newValues) {
        let newState = Object.assign({}, this.state);
        newState.actions[index] = newValues;
        this.setState(newState);
    }

    generateActionEdits() {
        let values = [];
        for (let i = 0; i < this.state.actions.length; i++) {
            values.push(<ActionEdit key={i} actionObj = {this.state.actions[i]}
                theme = {this.props.theme}/>)
        }
        return values;
    }

    toggleActive() {
        let newState = Object.assign({}, this.state);
        newState.active = !this.state.active;
        this.setState(newState);
    }

    addPanel() {
        let action = {id : 0, timing : 0, isTrigger : false, transition : false,
            actionType : "default", priority : 1, options : "empty", layer : 0, active : false,
            panelId : this.props.panel.id, nextPanelId : this.props.panel.id, resourceId : 1};
        let newState = Object.assign({}, this.state);
        newState.actions.push(action);
        this.setState(newState);
    }

    removeUnsaved() {
        let newState = Object.assign({}, this.state);
        newState.actions = newState.actions.filter(a => a.id !== 0);
        this.setState(newState);
    }

    updateRequest() {
        this.updateActions();
    }
    
    render() {
      return (
        <div>
            {this.props.panel.start &&
                <div>
                    <div>Thumbnail Image</div>
                    <form>
                        <input type="file" onChange={this.fileUpdate} accept="image/jpeg, image/png" />
                    </form>
                    <div className={`${this.props.theme}-btn-one ${this.props.theme}-font-color btn`}
                      onClick={() => this.handleImageSubmit()}>Submit</div>
                </div>
            }
            <div>
                {"Panel ID: " + this.props.panel.id}
            </div>
            {!this.props.panel.start &&
                <div>
                    <span>Panel Number:</span>
                    <input type="text" name="panelNum" value={this.state.panelNum}
                      onChange = {this.handleChange } />
                </div>
            }
            
            <div>
                {!this.props.panel.start &&
                    <div className = {`${this.props.theme}-btn-one ${this.props.theme}-font-color btn`}
                      onClick = {() => this.toggleActive() }>{this.state.active ? "Active" : "Hidden"}
                    </div>
                }
                <div className = {"col-3 btn btn-primary"}
                    onClick = {() => this.addPanel() }>
                        Add
                </div>
                <div className = {"col-3 btn btn-primary"}
                    onClick = {() => this.updateRequest() }>
                        Save
                </div>
                <div className = {"col-3 btn btn-primary"}
                    onClick = {() => this.removeUnsaved() }>
                        Cancel
                </div>
            </div>
            <div>
                Please save changes and then submit
            </div>
            {this.generateActionEdits()}
        </div>
      );
    }

    async updateActions() {
        if (this.state.panelNum < 1 && !this.props.panel.start) {
            alert("Only starting panel can be 0!");
            return;
        }
        const token = await authService.getAccessToken();
        const requestOptions = {
            method: 'Put',
            headers: {'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
            body: JSON.stringify({ comicName : this.props.comicName, panelId : this.props.panel.id, 
                number : this.state.panelNum, actions : this.state.actions, active : this.state.active})
        }
        // In case user continues typing and it becomes something different
        const response = await fetch('api/Account/UpdateActions', requestOptions);
        const data = await response.json();

        if (data.result === "Success") {
            this.props.workStationCallBack(data);
        }
        
    }

    async postResource() {
        const token = await authService.getAccessToken();
        const formData = new FormData();
        formData.append(
            "file",
            this.state.file,
            this.state.file.name
        );
        formData.append("comic", this.props.comicName);

        const requestOptions = {
            method: 'Put',
            headers: {'Authorization': `Bearer ${token}`},
            body: formData
        }
        // In case user continues typing and it becomes something different
        const response = await fetch('api/Account/PostThumbnail', requestOptions);
        const data = await response.json();
        if (data.result === "Success") {
            alert("Image upload successful!");
        } else {
            alert('Error Uploading. Please try again.');
        }
    }
}

export default PanelEditor;