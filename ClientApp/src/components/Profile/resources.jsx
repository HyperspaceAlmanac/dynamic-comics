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
            userResources : [],
            filterCommon : "",
            filterUser : ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileUpdate = this.fileUpdate.bind(this);
    }

    componentDidMount() {
        this.getResources();
    }

    resourceList(valueType) {
        let result = [];
        let temp;
        if (valueType === "common") {
            for (let i = 0; i < this.state.commonResources.length; i++) {
                temp = this.state.commonResources[i];
                if (this.state.filterCommon === "" ||
                  temp.imageURL.toLowerCase().includes(this.state.filterCommon.toLowerCase())) {
                    result.push(
                    <div className="col-3" key={result.length}>
                        <div>{temp.imageURL}</div>
                        <img className="img-fluid col-12" src={process.env.PUBLIC_URL + "images/" + temp.imageURL} alt="Resource Thumbnail" />
                    </div>
                    );
                }
            }
        } else {
            for (let i = 0; i < this.state.userResources.length; i++) {
              temp = this.state.userResources[i];
                if (this.state.filterUser === "" ||
                    temp.imageURL.toLowerCase().includes(this.state.filterUser.toLowerCase())) {
                        result.push(
                            <div className="col-3" key={result.length}>
                                <div>{temp.imageURL}</div>
                                <img className="img-fluid col-12" src={process.env.PUBLIC_URL + "images/" + temp.imageURL} alt="Resource Thumbnail" />
                            </div>
                        );
                }
            }
        }
        return result;
    }

    processResources(data) {
        let newState = Object.assign({}, this.state);
        newState.commonResources = data.common;
        newState.userResources = data.user;
        this.setState(newState);
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
            <div>
                <div>Filter by Name</div>
                <input type="text"
                    onChange={this.handleChange} name="filterCommon" value={this.state.filterCommon} />
            </div>
            {this.state.commonResources.length > 0 &&
                <div className="row">
                    {this.resourceList('common')}
                </div>
            } 
            <div className="h3">Personal Resources:</div>
            <div>
                <div>Filter by Name</div>
                <input type="text"
                    onChange={this.handleChange} name="filterUser" value={this.state.filterUser} />
            </div>
            {this.state.userResources.length > 0 &&
                <div className="row">
                    {this.resourceList('user')}
                </div>
            } 
        </div>
      );
    }
    async getResources() {
        const token = await authService.getAccessToken();
        const requestOptions = {
            method: 'Get',
            headers: {'Authorization': `Bearer ${token}`}
        }
        const response = await fetch('api/Account/GetResources', requestOptions);
        const data = await response.json();
        if (data.result === "Success") {
            console.log(data);
            this.processResources(data);
        } else {
            alert('Error Uploading. Please try again.');
        }
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
            this.processResources(data);
        } else {
            alert('Error Uploading. Please try again.');
        }
    }
}

export default Resources;