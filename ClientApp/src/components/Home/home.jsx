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
      currentPage : "waitForLogin"
    }
  }

  setState(page) {
    this.state = {
      currentPage : page
    }
  }

  function 

  render () {
    switch (this.state.currentPage) {
      case "waitForLogin":
        return (<WaitForLogin navCallback = {this.setState} />);
      case "main":
        return (<Main navCallback = {this.setState} />);
      case "completeRegistration":
      case "profile":
        return (<Profile navCallback = {this.setState} />);
      case "reader":
        return (<Reader navCallback = {this.setState} />);
      case "workstation":
        return (<Workstation navCallback = {this.setState} />);
      default:
        return (<WaitForLogin navCallback = {this.setState} />);

    }
  }

  async getUserStatus() {
    const token = await authService.getAccessToken();
    const response = await fetch('api/Account/', {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
  }
}

export default Home;
