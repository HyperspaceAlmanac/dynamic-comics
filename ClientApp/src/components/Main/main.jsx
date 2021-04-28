import React, { Component } from 'react';
import Comic from '../Comic/comic';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
          comicsDisplayed : this.populateComics()
        }
    }
    // Will eventually do API call to backend
    populateComics() {
        let comics = []
        for (let i = 0; i < 15; i++) {
          comics.push(<Comic key={i} comicName = "Something"
            coverURL = "grayDefault.png" genreOne = "Comedy" genreTwo="Action"
            rating = "4" numComments = "15" visitComic = {() => this.props.visitComic("Something" + i)}/>);
        }
        return comics;
    }
    render() {
      console.log("comics: ");
      console.log(this.state.comicsDisplayed);
      return (
        <div>
            <div>Placeholder for main page with a lot of comics displayed, popular comics, latest comments</div>
            <div className="row">
              {this.state.comicsDisplayed}
            </div>
        </div>
      );
    }
}

export default Main;