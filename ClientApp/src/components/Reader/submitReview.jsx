'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import '../themes.css';

class SubmitReview extends Component {

  constructor(props) {
      super(props);

      this.state = {
          message : "Leave Comments Here",
          rating : 5
      }

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    if (event.target.name == "rating") {
      let value = event.target.value;
      if (value == "1" || value == "2" || value == "3" || value == "4" || value =="5") {
        value = parseInt(value);
      } else {
        value = 1;
      }
      let newState = Object.assign({}, this.state);
      newState[event.target.name] =  value;
      this.setState(newState);
    } else {
      let value = event.target.value;
      if (value.length > 200) {
        value = value.substring(0, 200);
      }
      let newState = Object.assign({}, this.state);
      newState[event.target.name] =  value;
      this.setState(newState);
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    
  }

  handleReviewResponse(review) {
    let newState = Object.assign({}, this.state);
    newState.rating = review.rating;
    newState.message = review.message;
    this.setState(newState);
  }

  render() {
    return (
      <div>
          <form onSubmit={this.handleSubmit}>
              <div>
                  <div className="h3">Rating (out of 5):</div>
                  <input type="text" name="rating" value={this.state.rating}
                    onChange={this.handleChange} />
              </div>
              <div>
                  <div className="h3">Description (200 characters limit):</div>
                  <textarea className="col-md-10 larger-box" type="text" name="message" value={this.state.message}
                    onChange={this.handleChange} />
              </div>
              <div>
                  <input className={`${this.props.theme}-btn-one ${this.props.theme}-font-color btn`} type="submit" value="Update" />
              </div>
              
          </form>
      </div>
    );
  }

  async getReview() {
    const token = await authService.getAccessToken();
    const requestOptions = {
        method: 'Put',
        headers: {'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
        body: JSON.stringify({ requestType : "getReview", target : this.props.comicSeries })
    }
    // In case user continues typing and it becomes something different
    const response = await fetch('api/Account/GetReview', requestOptions);
    const data = await response.json();
    if (data.result === "Success") {
        if (data.reviews.length == 1){ 
          this.handleReviewResponse(data.reviews[0]);
        }
    } else {
        alert('Error with retrieving review');
    }
  }

  async postReview() {
    const token = await authService.getAccessToken();
    const requestOptions = {
        method: 'Put',
        headers: {'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
        body: JSON.stringify({ comicSeries : this.props.comicSeries, rating : this.state.rating, description: this.state.message })
    }
    // In case user continues typing and it becomes something different
    const response = await fetch('api/Account/PostReview', requestOptions);
    const data = await response.json();
    if (data.result === "Success") {
        if (data.reviews.length == 1){ 
          this.handleReviewResponse(data.reviews[0]);
        }
    } else {
        alert('Error retrieving review. Please try again.');
    }
  }
}

export default SubmitReview;