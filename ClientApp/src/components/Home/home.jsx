import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService'
import Main from '../Main/main';
import Profile from '../Profile/profile';
import Reader from '../Reader/reader';
import WaitForLogin from '../WaitForLogin/waitForLogin';
import Workstation from '../Workstation/workstation';

class Home extends Component {
  static displayName = Home.name;
  constructor(props) {
    super(props);
    this.state = {
      currentPage : "waitForLogin",
      userName : "",
      loading : true,
      target : ""
    }
  }

  setPageFunction(page) {
    console.log("Setting current page to " + page)
    let newState = Object.assign({}, this.state);
    newState.curentPage = page;
    this.setState(newState);
  }
  
  visitComic(name) {
    let newState = Object.assign({}, this.state);
    newState.currentPage = "reader";
    newState.target = name;
    console.log("Visiting comic page for");
    console.log(newState);
    this.setState(newState);
  }

  componentDidMount() {
    this.getUserStatus();
  }

  handleUserStatusResponse(data) {
    let authenticated = data["authenticated"];
    let loggedIn = data["loggedIn"];
    let userName = data["userName"];
    
    let newState = Object.assign({}, this.state);
    if (authenticated && loggedIn) {
        newState.currentPage = "main";
        newState.userName = userName;
    } else {
      newState.currentPage = "waitForLogin";
    }
    this.setState(newState);
  }

  render () {
    console.log("Home Render");
    console.log(this.state.currentPage);
    switch (this.state.currentPage) {
      case "waitForLogin":
        return (<WaitForLogin navCallback = {this.setPageFunction} />);
      case "main":
        return (<Main userName = {this.state.userName} navCallback = {(page) => this.setPageFunction(page)} visitComic = {(comic) => this.visitComic(comic)}/>);
      case "completeRegistration":
      case "profile":
        return (<Profile userName = {this.state.userName} navCallback = {(page) => this.setPageFunction(page)} />);
      case "reader":
        return (<Reader comicTitle = {this.state.target} navCallback = {(page) => this.setPageFunction(page)} />);
      case "workstation":
        return (<Workstation navCallback = {(page) => this.setPageFunction(page)} />);
      default:
        return (<WaitForLogin navCallback = {(page) => this.setPageFunction(page)} />);

    }
  }

  async getUserStatus() {
    const token = await authService.getAccessToken();
    const response = await fetch('api/Account/Home', {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    this.handleUserStatusResponse(data);
    console.log("handling response data");
  }
}

export default Home;
