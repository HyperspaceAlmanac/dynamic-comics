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
      registered : false,
      loading : true
    }
  }

  setStateFunction(page) {
    let newState = Object.assign({}, this.state);
    newState.curentPage = page;
    this.setState(newState);
  }

  componentDidMount() {
    this.getUserStatus();
  }

  handleUserStatusResponse(data) {
    let authenticated = data["authenticated"];
    let loggedIn = data["loggedIn"];
    let registered = data["registered"];
    
    let newState = Object.assign({}, this.state);
    if (authenticated && loggedIn) {
      if (!registered) {
        newState.currentPage = "profile";
      } else {
        newState.currentPage = "main";
      }
    } else {
      newState.currentPage = "waitForLogin";
    }
    this.setState(newState);
  }

  render () {
    switch (this.state.currentPage) {
      case "waitForLogin":
        return (<WaitForLogin navCallback = {this.setStateFunction} />);
      case "main":
        return (<Main navCallback = {this.setStateFunction} />);
      case "completeRegistration":
      case "profile":
        return (<Profile registered = {this.state.registered} navCallback = {this.setStateFunction} />);
      case "reader":
        return (<Reader navCallback = {this.setStateFunction} />);
      case "workstation":
        return (<Workstation navCallback = {this.setStateFunction} />);
      default:
        return (<WaitForLogin navCallback = {this.setStateFunction} />);

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
