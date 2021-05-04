'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import Comic from '../Comic/comic';
import '../themes.css';

class Comics extends Component {
    constructor(props) {
      super(props);
      this.state = {
        comics : [],
        user : "",
        theme: "science"
      }
    }


    componentDidMount() {
        this.getComics();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.profileOwner !== this.props.profileOwner ||
            prevState.user !== this.state.user ||
            (this.state.user === this.props.profileOwner &&
                this.props.theme !== prevProps.theme)) {
                //console.log("Comics component did change, updating state");
                this.getComics();
        }
    }
    clickComicAction(comicName) {
        if (this.props.profileOwner !== this.state.user) {
            this.props.visitOtherComic(comicName);
        } else {
            this.props.visitOwnComic(comicName);
        }
    }

    render() {
        if (this.state.comics.length > 0) {
            return (
                <div className="row col-12">
                    <div className="col-12 h3">{this.props.showProgress ? "Continue Reading:" :
                        (this.props.profileOwner !== this.state.user ? `Comic Series by ${this.props.profileOwner}:` : "Your Comic Series (Click to Edit in Workstation):")}</div>
                    {this.state.comics}
                </div>
            );
        } else {
            return (
                <div></div>
            );
        }
    }

    async getComics() {
        const token = await authService.getAccessToken();
        let requestParam = this.props.showProgress ? "history" : "partial";
        const requestOptions = {
            method: 'Put',
            headers: {'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
            body: JSON.stringify({ requestType : requestParam, user : this.props.profileOwner })
        }
        // In case user continues typing and it becomes something different
        const response = await fetch('api/Account/GetComics', requestOptions);
        const data = await response.json();
        let jsonComics = [];
        if (data.result === "Success") {
            jsonComics = data.comicObjects;
            let comics = [];
            for (let i = 0; i < jsonComics.length; i++) {
                comics.push(<Comic key={i} comicName = {jsonComics[i].comicName} theme={this.props.profileOwner === data.userName ? this.props.theme : data.theme}
                coverURL = {jsonComics[i].coverURL} genreOne = {jsonComics[i].genreOne} genreTwo={jsonComics[i].genreTwo} author={jsonComics[i].author}
                showAuthor = {this.props.showProgress || (data.userName !== this.props.profileOwner)}
                rating = {jsonComics[i].rating} numComments = {jsonComics[i].numComments} progress = {this.props.showProgress}
                progressValue = {jsonComics[i].progress} published = {jsonComics[i].published}  
                visitComic = {() => this.clickComicAction(jsonComics[i].comicName)}
                visitAuthor = {() => this.props.visitAuthor(jsonComics[i].author)}/>);
            }

            let newState = Object.assign({}, this.state);
            newState.comics = comics;
            newState.user = data.userName;
            if (this.props.profileOwner !== this.state.user) {
                newState.theme = data.theme;
            }
            newState.theme = data.theme;
            this.setState(newState);
        }     
    }
}

export default Comics;