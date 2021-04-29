import React, { Component } from 'react';

class Comic extends Component {
    constructor(props) {
      super(props);
      // Pass in name, author, image URL, genres
    }

    render() {
      return (
        <div className="col-3">
            <div>{this.props.comicName}</div>
            {this.props.showAuthor &&
              <div className="btn btn-info col-12" onClick={() => this.props.visitAuthor()}>{"by " + this.props.author}</div>
            }
            <img src={process.env.PUBLIC_URL + "images/" + this.props.coverURL} alt="Comic book cover" onClick={() => this.props.visitComic()}/>
            <div>{this.props.genreOne + ", " + this.props.genreTwo}</div>
            <div>{"Rating: " + this.props.rating + "/5 Comments: " + this.props.numComments}</div>
            {this.props.progress &&
              <div>{"Progress: " + this.props.progressValue}</div>
            }
            <div>{} </div>
        </div>
      );
    }
}

export default Comic;