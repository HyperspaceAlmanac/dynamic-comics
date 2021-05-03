
'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import '../themes.css';

class CreateComic extends Component {
    constructor(props) {
      super(props);
      this.state = { title: '', genreOne: '', genreTwo: ''}
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        this.createComicAPI();
    }

    render() {
      return (
        <div>
            <div className="h3">Create a new Comic Series</div>
            <form onSubmit={this.handleSubmit}>
                <div className="row">
                    <div className="col-4">
                        <div>Name:</div>
                        <input type="text" name="title" value={this.state.title} required
                        onChange={this.handleChange} />
                    </div>
                    <div className="col-3">
                        <div>Primary Genre:</div>
                        <input type="text" name="genreOne" value={this.state.genreOne} required
                        onChange={this.handleChange} />
                    </div>
                    <div className="col-3">
                        <div>Secondary Genre:</div>
                        <input type="text" name="genreTwo" value={this.state.genreTwo} required
                        onChange={this.handleChange} />
                    </div>
                    <div className="col-2">
                        <br/>
                        <input className={`${this.props.theme}-btn-one ${this.props.theme}-font-color btn`} type="submit" value="Create" />
                    </div>
                </div>
            </form>
        </div>
      );
    }

    async createComicAPI() {
        const token = await authService.getAccessToken();
        const requestOptions = {
            method: 'Put',
            headers: {'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
            body: JSON.stringify({ name : this.state.title, genreOne : this.state.genreOne, genreTwo : this.state.genreTwo })
        }
        // In case user continues typing and it becomes something different
        let comicName = this.props.title;
        const response = await fetch('api/Account/CreateComic', requestOptions);
        const data = await response.json();
        if (data.result === "Success") {
            alert('Comic created successfully! Redirecting to workstation page');
            this.props.navCallback("workstation", comicName);
        } else {
            alert('A comic with this title already exists. Please try again.');
        }
    }
}

export default CreateComic;