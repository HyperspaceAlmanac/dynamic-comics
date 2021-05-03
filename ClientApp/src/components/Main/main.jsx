'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService'
import Comic from '../Comic/comic';
import Tabs from '../Tabs/tabs';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
          allComics : [],
          theme : "science",
          font : "arial",
          sorting: "all",
          filterName: "",
          filterAuthor: "",
          filterGenre: ""
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
      this.fetchComics();
    }
    handleChange(event) {
      let newState = Object.assign({}, this.state);
      newState[event.target.name] = event.target.value;
      this.setState(newState);

    }
    // Will eventually do API call to backend
    sortComics() {
      let shallowCopy = [...this.state.allComics];
      // Check filter first
      if (this.state.filterName !== "") {
        shallowCopy = shallowCopy.filter(
          entry => entry.comicName.toLowerCase().includes(this.state.filterName.toLowerCase()));
      }
      if (this.state.filterAuthor !== "") {
        shallowCopy = shallowCopy.filter(
          entry => entry.author.toLowerCase().includes(this.state.filterAuthor.toLowerCase()));
      }
      if (this.state.filterGenre !== "") {
        shallowCopy = shallowCopy.filter(
          entry => entry.genreOne.toLowerCase().includes(this.state.filterGenre.toLowerCase())
          || entry.genreTwo.toLowerCase().includes(this.state.filterGenre.toLowerCase()));
      }
      if (this.state.sorting === "alphabet") {
        shallowCopy.sort((a, b) => {
          if (a.comicName < b.comicName) {
            return -1;
          }
          if (a.comicName > b.comicName) {
            return 1;
          }
          return 0;
        });

      } else if (this.state.sorting === "rating") {
        shallowCopy.sort((a, b) => {
          if (a.rating > b.rating) {
            return -1;
          }
          if (a.rating < b.rating) {
            return 1;
          }
    
          return 0;
        });
      } else if (this.state.sorting === "comments") {
        shallowCopy.sort((a, b) => {
          if (a.numComments > b.numComments) {
            return -1;
          }
          if (a.numComments < b.numComments) {
            return 1;
          }
    
          return 0;
        });
      }
      console.log(shallowCopy);
      let comics = [];
      for (let i = 0; i < shallowCopy.length; i++) {
        comics.push(<Comic key={i} comicName = {shallowCopy[i].comicName} theme = {this.state.theme}
          coverURL = {shallowCopy[i].coverURL} genreOne = {shallowCopy[i].genreOne} genreTwo={shallowCopy[i].genreTwo} author={shallowCopy[i].author} showAuthor={true}
          rating = {shallowCopy[i].rating} numComments = {shallowCopy[i].numComments} visitComic = {() => this.props.navCallback("reader", shallowCopy[i].comicName)}
          visitAuthor = {() => this.props.navCallback("profile", shallowCopy[i].author)}/>);
      }
      return comics;
    }

    sortCriteria(criteria) {
      console.log("In set sort Criteria for " + criteria);
      let newState = Object.assign({}, this.state);
      newState.sorting = criteria;
      if (criteria === "all") {
        newState.filterName = "";
        newState.filterAuthor = "";
        newState.filterGenre = "";
      }
      this.setState(newState);
    }

    addButtons() {
      let buttons = [];
      buttons.push({name: "Show All", buttonAction : () => this.sortCriteria("all"), width: "col-3"});
      buttons.push({name: "Alphabetical Order", buttonAction : () => this.sortCriteria("alphabet"), width: "col-3"});
      buttons.push({name: "Highest Rated", buttonAction : () => this.sortCriteria("rating"), width: "col-3"});
      buttons.push({name: "Most Comments", buttonAction : () => this.sortCriteria("comments"), width: "col-3"});
      return buttons;
    }
    render() {
      console.log("comics: ");
      console.log(this.state.allComics);
      return (
        <div className={`row ${this.state.theme}-bg1 ${this.state.font} ${this.state.theme}-font-color`}>
          <div className="btn btn-info" onClick = {() => this.props.navCallback("profile", this.props.userName)}>Got to Profile</div>
          <Tabs buttons={this.addButtons()}/>
          <br/>
          <div className="col-12">Filter By</div>
          <br/>
          <form className="row col-12">
            <div className="col-4">
              <span>Name:  </span>
              <input type="text" name="filterName" value={this.state.filterName}
                onChange={this.handleChange} />
            </div>
            <div className="col-4">
              <span>Author:  </span>
              <input type="text" name="filterAuthor" value={this.state.filterAuthor}
                onChange={this.handleChange} />
            </div>
            <div className="col-4">
              <span>Genre:  </span>
              <input type="text" name="filterGenre" value={this.state.filterGenre}
                onChange={this.handleChange} />
            </div>
          </form>
          <div className="row col-12">
            {this.sortComics()}
          </div>
        </div>
      );
    }

    async fetchComics() {
      const token = await authService.getAccessToken();
        const requestOptions = {
          method: 'Put',
          headers: {'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
          body: JSON.stringify({ requestType : "all", user : this.props.userName })
        }
        // In case user continues typing and it becomes something different
        const response = await fetch('api/Account/GetComics', requestOptions);
        const data = await response.json();
        let comics = [];
        if (data.result === "Success") {
            for (let i = 0; i < data.comicObjects.length; i++) {
              comics.push(data.comicObjects[i]);
            }
        } else {
            alert('Something went wrong');
      }
      
      let newState = Object.assign({}, this.state);
      newState.allComics = comics;
      newState.theme = data.theme;
      newState.font = data.font;
      this.setState(newState);
    }
}

export default Main;