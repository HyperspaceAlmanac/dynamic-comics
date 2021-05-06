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
            actions : []
        }
        this.fileUpdate = this.fileUpdate.bind(this);
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

    componentDidMount() {
        let newState = Object.assign({}, this.state);
        newState.actions = this.props.panel.actions;
        this.setState(newState);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.panel !== this.props.panel) {
            let newState = Object.assign({}, this.state);
            newState.actions = this.props.panel.actions;
            this.setState(newState);
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

    addPanel() {

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
                Panels Editor
            </div>
            <div>
                {"Panel ID: " + this.props.panel.Id}
            </div>
            <div>
                Need to pass in Panel Number
            </div>
            <div>
                Make Sure to save before going to Timeline or Resources page!
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
            body: JSON.stringify({ panelId : this.props.panel.Id, })
        }
        // In case user continues typing and it becomes something different
        //const response = await fetch('api/Account/GetComics', requestOptions);
        //const data = await response.json();
        
             
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