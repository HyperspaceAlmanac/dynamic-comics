'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import '../themes.css';

class Reviews extends Component {
    constructor(props) {
      super(props);
      this.state = {
        reviews : [],
        user : ""
      }
    }


    componentDidMount() {
        let newState = Object.assign({}, this.state);
        newState.reviews = this.getReviews();
        this.setState(newState);
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.profileOwner !== this.props.profileOwner
            || prevState.user !== this.state.user || 
            (this.props.profileOwner === this.state.user && this.props.theme !== prevProps.theme)) {
                //console.log("Comics component did change, updating state");
                this.getReviews();
        }
    }

    render() {
        if (this.props.perUser) {
            if (this.state.reviews.length > 0) {
                return (
                    <div className="row col-12">
                        <div className="col-12 h3">{this.props.profileOwner === this.state.user ? "Your Reviews (Can only be Edited in Comic Reader):": "Reviews by " + this.props.profileOwner}</div>
                        {this.state.reviews}
                    </div>);
            } else {
                return (
                    <div className="h3">
                        No Reviews Found
                    </div>
                );
            }
            
        } else {
            if (this.state.reviews.length > 0) {
                return (
                    <div className="row col-12">
                        <div className="col-12 h3">{"Reviews for: " + this.props.SeriesName}</div>
                        {this.state.reviews}
                    </div>);
            } else {
                return (
                    <div className="h3">
                        No Reviews Found
                    </div>
                );
            }
        }
    }

    async getReviews() {
        const token = await authService.getAccessToken();
        const requestOptions = {
            method: 'Put',
            headers: {'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
            body: JSON.stringify({ requestType : this.props.perUser ? "User" : "Comic",
                target : this.props.perUser ? this.props.profileOwner : this.props.seriesName })
        }
        // In case user continues typing and it becomes something different
        const response = await fetch('api/Account/GetReviews', requestOptions);
        const data = await response.json();
        if (data.result === "Success") {
            console.log(data);
            let reviewsJson = data.reviews;
            let reviews = [];
            for (let i = 0; i < reviewsJson.length; i++) {
                if (this.props.perUser) {
                    reviews.push(
                        <div className="col-3" key={i}>
                            <div className={`${this.props.theme}-btn-one ${this.props.theme}-font-color` + " btn col-12"} onClick={() => this.props.visitComic(reviewsJson[i].name)}>{reviewsJson[i].name}</div>
                            <div className={`${this.props.theme}-btn-two ${this.props.theme}-font-color2` + " btn col-12"} onClick={() => this.props.visitAuthor(reviewsJson[i].author)}>{reviewsJson[i].author}</div>
                            <div>{"Average Rating: " + reviewsJson[i].averageRating + "/5"}</div>
                            <div>{(this.props.profileOwner === this.state.user ? "Your Rating: " : "This User's Rating: ") + `${reviewsJson[i].personalRating}/5`}</div>
                            <div>{"Date: " + reviewsJson[i].date}</div>
                            <div>{"Description: " + reviewsJson[i].description}</div>
                        </div>
                    );
                } else {
                    reviews.push(
                        <div className="col-12" key={i}>
                            <div className={`${this.props.theme}-btn-two ${this.props.theme}-font-color2` + " btn col-12"} onClick={() => this.props.visitAuthor(reviewsJson[i].author)}>{reviewsJson[i].author}</div>
                            <div>{`Rating: ${reviewsJson[i].rating}/5`}</div>
                            <div>{"Date: " + reviewsJson[i].date}</div>
                            <div>{"Description: " + reviewsJson[i].description}</div>
                        </div>
                    );
                }
            }
            let newState = Object.assign({}, this.state);
            newState.reviews = reviews;
            newState.user = data.user;
            this.setState(newState);
        } else {
            alert("Error with Get Reviews");
        }
    }
}

export default Reviews;