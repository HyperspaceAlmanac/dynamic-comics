'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import '../themes.css';

class Resources extends Component {

    constructor(props) {
        super(props);

        this.state = {
            file : null,
            fileName : "",
            common : false,
            commonResources : [],
            sharedResources : []
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileUpdate = this.fileUpdate.bind(this);
    }

    fetchResources() {

    }

    fileUpdate(event) {
        let newState = Object.assign({}, this.state);
        newState.file = event.target.files[0];
        this.setState(newState);
    }

    toggleCommon() {
        let newState = Object.assign({}, this.state);
        newState.common =  !this.state.common;
        this.setState(newState);
    }

    handleChange(event) {
      let value = event.target.value;
      if (event.target.value.length > 30) {
        value = value.substring(0, 30);
      }
      let newState = Object.assign({}, this.state);
      newState[event.target.name] =  value;
      this.setState(newState);
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state.file.name);
        if (this.state.file !== null &&
        (this.state.file.name.endsWith(".png") ||
        this.state.file.name.endsWith(".jpg"))) {
            this.postResource();
        } else {
            alert("Please Only Upload PNG or JPEG");
        }
      
  }

    render() {
      return (
        <div>
            <form onSubmit={this.handleSubmit}>
              <div>
                  <div>Image Source(.PNG or .JPG Only):</div>
                  <input type="file"
                    onChange={this.fileUpdate} accept="image/jpeg, image/png" required />
              </div>
              <div>
                  <div>Save As (Without .png or .jpg extension):</div>
                  <div>Unique Identifier Will be Added in Front</div>
                  <input type="text"
                    onChange={this.handleChange} name="fileName" value={this.state.fileName} required />
              </div>
              <span>Share With Others:</span>
              <div className={this.state.common ?
                  `${this.props.theme}-btn-one ${this.props.theme}-font-color btn`
                  : `${this.props.theme}-btn-two ${this.props.theme}-font-color2 btn`
                  } onClick = {() => this.toggleCommon()}>{this.state.common ? "Yes" : "No" }</div>
              <div>
                  <input className={`${this.props.theme}-btn-one ${this.props.theme}-font-color btn`} type="submit" value="Upload" />
              </div>
              
          </form>
            <div className="h3">Common Resources:</div>
            <div className="h3">Personal Resources:</div>
        </div>
      );
    }
    async GetResources() {

    }

    async postResource() {
        const token = await authService.getAccessToken();
        const formData = new FormData();
        formData.append(
            "file",
            this.state.file,
            this.state.fileName.endsWith(".png") ? this.state.fileName + ".png"
                : this.state.fileName + ".jpg"
        );
        formData.append("Common", this.state.common ? "yes" : "no");

        const requestOptions = {
            method: 'Put',
            headers: {'Authorization': `Bearer ${token}`},
            body: formData
        }
        // In case user continues typing and it becomes something different
        const response = await fetch('api/Account/PostResource', requestOptions);
        const data = await response.json();
        if (data.result === "Success") {
            alert("Success");
            console.log(data);
        } else {
            alert('Error Uploading. Please try again.');
        }
    }
}

export default Resources;