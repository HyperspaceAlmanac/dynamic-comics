import React, { Component } from 'react';
import Comic from '../Comic/comic';
import Tabs from '../Tabs/tabs';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
          comicsDisplayed : this.populateComics(),
          buttonProperties : this.addButtons()
        }
    }
    // Will eventually do API call to backend
    populateComics() {
        let comics = [];
        for (let i = 0; i < 15; i++) {
          comics.push(<Comic key={i} comicName = "Something"
            coverURL = "grayDefault.png" genreOne = "Comedy" genreTwo="Action"
            rating = "4" numComments = "15" visitComic = {() => this.props.navCallback("reader", "Something" + i)}/>);
        }
        return comics;
    }
    addButtons() {
      let buttons = [];
      buttons.push({name: "Profile", buttonAction : () => this.props.navCallback("profile", ""), width: "col-3"});
      //buttons.push({name: "Profile", buttonAction : () => this.props.navCallBack("profile", "")});
      return buttons;
    }
    render() {
      console.log("comics: ");
      console.log(this.state.comicsDisplayed);
      console.log(this.state.buttonProperties);
      return (
        <div className="row">
            <Tabs buttons={this.state.buttonProperties}/>
            <div className="row col-9">
              {this.state.comicsDisplayed}
            </div>
            <div className="col-3">
              Column Here
            </div>
        </div>
      );
    }
}

export default Main;