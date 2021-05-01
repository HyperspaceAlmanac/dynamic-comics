import React, { Component } from 'react';
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
        let newState = Object.assign({}, this.state);
        newState.comics = this.getComics();
        newState.user = "MagicalPaintBrush";
        newState.theme = "noir";
        this.setState(newState);
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.profileOwner !== this.props.profileOwner
            || prevState.user !== this.state.user) {
                //console.log("Comics component did change, updating state");
                let newState = Object.assign({}, this.state);
                newState.comics = this.getComics();
                newState.user = "MagicalPaintBrush";
                this.setState(newState);
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
        //console.log("In render comics");
        //console.log(this.state.comics);
        //console.log(`Render Time User = ${this.state.user}, Render Time ProfileOwner = ${this.props.profileOwner} RenderTime length: ${this.state.comics.length}`);
      return (
        <div className="row col-12">
            <div className="col-12">{this.props.showProgress ? "Continue Reading:" :
                (this.props.profileOwner !== this.state.user ? `Comic Series by ${this.props.profileOwner}:` : "Your Comic Series:")}</div>
            {this.state.comics}
        </div>
      );
    }

    getComics() {
        let jsonComics = [];
        if (this.props.showProgress) {
            for (let i = 0; i < 5; i++) {
                jsonComics.push({comicName: "something" + i, coverURL : "grayDefault.png", genreOne : "Comedy", genreTwo : "Action",
                rating : i % 6, numComments : Math.min(20, 2 * i), author : "somebody", progress : 10});

            }

        } else {
            for (let i = 0; i < 3; i++) {
                jsonComics.push({comicName: "fun series" + i, coverURL : "grayDefault.png", genreOne : "Comedy", genreTwo : "Action",
                rating : (2 + i) % 6, numComments : Math.min(20, 2 * i), author : this.props.profileOwner, progress : 0});
            }
        }
        let comics = [];
        //console.log(this.state.user !== this.props.profileOwner);
        for (let i = 0; i < jsonComics.length; i++) {
            comics.push(<Comic key={i} comicName = {jsonComics[i].comicName} theme={this.state.theme}
            coverURL = {jsonComics[i].coverURL} genreOne = {jsonComics[i].genreOne} genreTwo={jsonComics[i].genreTwo} author={jsonComics[i].author}
            showAuthor = {this.props.showProgress || (this.state.user !== this.props.profileOwner)}
            rating = {jsonComics[i].rating} numComments = {jsonComics[i].numComments} progress = {this.props.showProgress} progressValue = {jsonComics[i].progress}  
            visitComic = {() => this.clickComicAction(jsonComics[i].comicName)}
            visitAuthor = {() => this.props.visitAuthor(jsonComics[i].author)}/>);
        }
        //console.log("Get comics");
        //console.log(comics);
        return comics;
    }
}

export default Comics;