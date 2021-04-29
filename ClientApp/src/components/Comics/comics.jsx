import React, { Component } from 'react';
import Comic from '../Comic/comic';

class Comics extends Component {
    constructor(props) {
      super(props);
      this.state = {
        comics : []
      }
    }


    componentDidMount() {
        let newState = Object.assign({}, this.state);
        newState.comics = this.getComics();
        this.setState(newState);
    }

    clickComicAction(comicName) {
        if (this.props.readComics) {
            this.props.visitOtherComic(comicName);
        } else {
            this.props.visitOwnComic(comicName);
        }
    }

    render() {
      return (
        <div className="row col-12">
            <div className="col-12">{this.props.readComics ? (this.props.profileOwner === "MagicalPaintBrush" ? "Continue Reading:" : `Comic Series by ${this.props.profileOwner}:`) : "Your Comic Series:"}</div>
            {this.state.comics}
        </div>
      );
    }

    getComics() {
        let jsonComics = [];
        if (this.props.readComics) {
            for (let i = 0; i < 5; i++) {
                jsonComics.push({comicName: "something" + i, coverURL : "grayDefault.png", genreOne : "Comedy", genreTwo : "Action",
                rating : i % 6, numComments : Math.min(20, 2 * i), author : "somebody", progress : 10});

            }

        } else {
            for (let i = 0; i < 3; i++) {
                jsonComics.push({comicName: "fun series" + i, coverURL : "grayDefault.png", genreOne : "Comedy", genreTwo : "Action",
                rating : (2 + i) % 6, numComments : Math.min(20, 2 * i), author : "MagicalPaintBrush", progress : 0});
            }
        }
        let showProgress = this.props.readComics && this.props.profileOwner === "MagicalPaintBrush";
        let comics = [];
        for (let i = 0; i < jsonComics.length; i++) {
            comics.push(<Comic key={i} comicName = {jsonComics[i].comicName}
            coverURL = {jsonComics[i].coverURL} genreOne = {jsonComics[i].genreOne} genreTwo={jsonComics[i].genreTwo} author={jsonComics[i].author} showAuthor={this.props.readComics}
            rating = {jsonComics[i].rating} numComments = {jsonComics[i].numComments} progress = {showProgress} progressValue = {jsonComics[i].progress}  
            visitComic = {() => this.clickComicAction(jsonComics[i].comicName)}
            visitAuthor = {() => this.props.visitAuthor(jsonComics[i].author)}/>);
        }
        return comics;
    }
}

export default Comics;