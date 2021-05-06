'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import '../themes.css';
import ResourceList from '../Workstation/resourceList';

class Comments extends Component {
    constructor(props) {
      super(props);
      this.state = {
        comments : [],
        comment : ""
      }
      this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        let newState = Object.assign({}, this.state);
        newState.comment = event.target.value;
        this.setState(newState);
    }

    handleSubmit() {
        if (this.state.comment === "") {
            alert("Please enter a comment before saving");
        } else {
            this.addComment();
        }
    }

    componentDidMount() {
        this.getComments();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.panel !== this.props.panel) {
            this.getComments();
        }
    }
    displayComments() {
        let result = [];
        let i;
        for (i = 0; i < this.state.comments.length; i++) {
            if (this.state.comments[i].panelNumber === this.props.current) {
                result.push(
                  <div key = {result.length}>
                    <div className="h3">
                      {this.state.comments[i].commentor}
                    </div>
                    <div>
                      {this.state.comments[i].time}
                    </div>
                    <div>
                      {this.state.comments[i].description}
                    </div>
                    <br/>
                  </div>
                );
            }
        }
        return result;
    }

    render() {
        return (
            <div>
                <div className="h3 col-12">{`Panel Number: ${this.props.panel.number}`}</div>
                <div className="h4 col-12">{`Page Number: ${this.props.current}`}</div>
                <div className="h5 col-12">Your Comment</div>
                <textarea className="col-12" type="text" name="comment" value={this.state.comment}
                    onChange={this.handleChange} />
                <div className={`${this.props.theme}-btn-one ${this.props.theme}-font-color btn`} onClick = {() => this.handleSubmit()}>Add Comment</div>
                {this.state.comments.length > 0 &&
                    <div>
                        <div className="col-12">Comments:</div>
                        {this.displayComments()}
                    </div>
                }
                {this.state.comments.length == 0 &&
                    <div className="row col-12">
                        No Comments Found            
                    </div>
                }
            </div>
        );
    }
    async addComment() {
        const token = await authService.getAccessToken();
        const requestOptions = {
            method: 'Put',
            headers: {'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
            body: JSON.stringify({ panelId : this.props.panel.id, 
                panelNumber : this.props.current, description : this.state.comment})
        }
        // In case user continues typing and it becomes something different
        const response = await fetch('api/Account/SaveComment', requestOptions);
        const data = await response.json();
        if (data.result === "Success") {
            let newState = Object.assign({}, this.state);
            newState.comments = data.comments;
            newState.comment = "";
            this.setState(newState);
        } else {
            alert("Error when trying to add comment");
        }
    }

    async getComments() {
        const token = await authService.getAccessToken();
        const requestOptions = {
            method: 'Put',
            headers: {'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
            body: JSON.stringify({ panelId : this.props.panel.id })
        }
        // In case user continues typing and it becomes something different
        const response = await fetch('api/Account/GetComments', requestOptions);
        const data = await response.json();
        if (data.result === "Success") {
            let newState = Object.assign({}, this.state);
            newState.comments = data.comments;
            this.setState(newState);
        } else {
            alert("Error with Get Comments");
        }
    }
}

export default Comments;