'use strict';
import React, { Component } from 'react';
import '../themes.css';

class Comic extends Component {
    constructor(props) {
      super(props);
      // Pass in name, author, image URL, genres
    }

    render() {
      return (
        <div className="col-3">
            <div className={`${this.props.theme}-btn-one ${this.props.theme}-font-color` + " btn col-12"} onClick={() => this.props.visitComic()}>{this.props.comicName}</div>
            {this.props.showAuthor &&
              <div className={`${this.props.theme}-btn-two ${this.props.theme}-font-color2` + " btn col-12"} onClick={() => this.props.visitAuthor()}>{"by " + this.props.author}</div>
            }
            <img src={process.env.PUBLIC_URL + "images/" + this.props.coverURL} alt="Comic book cover" className="img-fluid col-10" onClick={() => this.props.visitComic()}/>
            <div>{this.props.genreOne + ", " + this.props.genreTwo}</div>
            <div>{"Rating: " + this.props.rating + "/5 Comments: " + this.props.numComments}</div>
            {this.props.progress &&
              <div>{"Progress: " + this.props.progressValue}</div>
            }
            {!this.props.showAuthor &&
              <div>{"Published: " + (this.props.published ? "Yes" : "No")}</div>
            }
        </div>
      );
    }
}

export default Comic;