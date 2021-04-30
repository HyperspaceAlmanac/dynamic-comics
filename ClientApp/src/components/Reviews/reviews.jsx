import React, { Component } from 'react';
import Comic from '../Comic/comic';

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
        newState.user = "MagicalPaintBrush";
        this.setState(newState);
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.profileOwner !== this.props.profileOwner
            || prevState.user !== this.state.user) {
                //console.log("Comics component did change, updating state");
                let newState = Object.assign({}, this.state);
                newState.reviews = this.getReviews();
                newState.user = "MagicalPaintBrush";
                this.setState(newState);
        }
    }

    render() {
      return (
        <div className="row col-12">
            <div className="col-12">{this.props.profileOwner === this.state.user ? "Your Reviews (Can only be Edited in Comic Reader):": "Reviews by " + this.props.profileOwner}</div>
            {this.state.reviews}
        </div>
      );
    }

    getReviews() {
        let reviewsJson = [];
        for (let i = 0; i < 5; i++) {
            reviewsJson.push({name: "book" + i, author: "author " + i, rating: i, description: "It was an okay series", average: (i % 4 + 0.5)});
        }
        let reviews = [];
        for (let i = 0; i < reviewsJson.length; i++) {
            reviews.push(
                <div className="col-3" key={i}>
                    <div className="btn btn-primary col-12" onClick={() => this.props.visitComic(reviewsJson[i].name)}>{reviewsJson[i].name}</div>
                    <div className="btn btn-info col-12"onClick={() => this.props.visitAuthor(reviewsJson[i].author)}>{reviewsJson[i].author}</div>
                    <div>{"Average Rating: " + reviewsJson[i].average + "/5"}</div>
                    <div>{(this.props.profileOwner === this.props.user ? "Your Rating: " : "This User's Rating: ") + `${reviewsJson[i].rating}/5`}</div>
                    <div>{"Description: " + reviewsJson[i].description}</div>
                </div>
            );
        }
        return reviews;
    }
}

export default Reviews;