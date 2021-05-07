'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import '../themes.css';

class ResourceList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            commonResources : [],
            userResources : [],
            filterCommon : "",
            filterUser : ""
        }

        this.handleChange = this.handleChange.bind(this);
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
                    <div className="col-6" key={result.length}>
                        <div>{"Image ID: " + temp.id}</div>
                        <div>{"Image URL: " + temp.imageURL}</div>
                        <img className="img-fluid" src={process.env.PUBLIC_URL + "images/" + temp.imageURL} alt="Resource Thumbnail" />
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
                            <div className="col-6" key={result.length}>
                                <div>{"Image ID: " + temp.id}</div>
                                <div>{"Image URL: " + temp.imageURL}</div>
                                <img className='img-fluid' src={process.env.PUBLIC_URL + "images/" + temp.imageURL} alt="Resource Thumbnail" />
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

    handleChange(event) {
      let value = event.target.value;
      let newState = Object.assign({}, this.state);
      newState[event.target.name] =  value;
      this.setState(newState);
    }

    render() {
      return (
        <div>
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
}

export default ResourceList;