'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService'
import Main from '../Main/main';
import Profile from '../Profile/profile';
import Reader from '../Reader/reader';
import WaitForLogin from '../WaitForLogin/waitForLogin';
import Workstation from '../Workstation/workstation';
import Donate from '../Donate/donate';

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

  setPageFunction(page, target) {
    console.log("Setting current page to " + page)
    let newState = Object.assign({}, this.state);
    newState.currentPage = page;
    newState.target = target;
    /**
    if (page === "workstation") {
      this.props.setContainerState(true);
    } else {
      this.props.setContainerState(false);
    } **/
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
    console.log(this.state);
    switch (this.state.currentPage) {
      case "waitForLogin":
        return (
          <div className="container">
            <WaitForLogin />
          </div>);
      case "main":
        return (
          <div className="container">
            <Main userName = {this.state.userName} navCallback = {(page, target) => this.setPageFunction(page, target)} />
          </div>);
      case "profile":
        return (
          <div className="container">
            <Profile userName = {this.state.userName} target = {this.state.target} navCallback = {(page, target) => this.setPageFunction(page, target)} />
          </div>);
      case "reader":
        return (
          <div className="container-fluid">
            <Reader comicTitle = {this.state.target} navCallback = {(page, target) => this.setPageFunction(page, target)} />
          </div>);
      case "workstation":
        return (
          <div className="container-fluid">
            <Workstation comicTitle = {this.state.target} navCallback = {(page, target) => this.setPageFunction(page, target)} />
          </div>);
      case "donate":
        return (
          <div className="container">
            <Donate author = {this.state.target} navCallback = {(page, target) => this.setPageFunction(page, target)} />
          </div>);
      default:
        return (
          <div className="container">
            <WaitForLogin navCallback = {(page, target) => this.setPageFunction(page, target)} />
          </div>);  
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
