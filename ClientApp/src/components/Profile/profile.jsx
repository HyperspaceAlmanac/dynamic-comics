'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import Tabs from '../Tabs/tabs';
import Comics from '../Comics/comics';
import Reviews from '../Reviews/reviews';
import Donations from '../Donations/donations';
import Workstation from '../Workstation/workstation';
import CreateComic from '../CreateComic/createComic';
import WelcomeMessage from './WelcomeMessage';
import '../themes.css';
class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
          pageState : "profile",
          theme : "science",
          user : "",
          font : "arial",
          message : "welcome"
        }
      }
    setPageState(pageState) {
      let newState = Object.assign({}, this.state);
      newState.pageState = pageState;
      this.setState(newState);
    }

    componentDidMount() {
      // Something here
      this.fetchUser();
    }

    handleUserResponse(data) {
      let newState = Object.assign({}, this.state);
      newState.user = data.loggedInUser;
      newState.theme = data.theme;
      newState.font = data.font;
      newState.message = data.message;
      this.setState(newState);
    }

    setFont(font) {
      let newState = Object.assign({}, this.state);
      newState.font = font;
      this.setUserProperty("font", font);
      this.setState(newState);
    }

    setTheme(theme) {
      let newState = Object.assign({}, this.state);
      newState.theme = theme;
      this.setUserProperty("theme", theme);
      this.setState(newState);
    }

    addFontButtons() {
      return(
        <div className="row col-12">
          <div className="col-4">Current Font: {this.state.font}</div>
          <div className="col-1 btn btn-secondary" onClick={() => this.setFont("arial")}>Arial</div>
          <div className="col-1 btn btn-secondary" onClick={() => this.setFont("luminari")}>Luminari</div>
          <div className="col-1 btn btn-secondary" onClick={() => this.setFont("monaco")}>Monaco</div>
          <div className="col-1 btn btn-secondary" onClick={() => this.setFont("courier")}>Courier</div>
          <div className="col-1 btn btn-secondary" onClick={() => this.setFont("cursive")}>Cursive</div>
        </div>
      );
    }

    addThemeButtons() {
      return(
        <div className="row col-12">
          <div className="col-4">Current Theme: {this.state.theme}</div>
          <div className="col-1 btn science-btn-one science-font-color" onClick={() => this.setTheme("science")}>Science</div>
          <div className="col-1 btn fantasy-btn-one fantasy-font-color" onClick={() => this.setTheme("fantasy")}>Fantasy</div>
          <div className="col-1 btn sweets-btn-one sweets-font-color" onClick={() => this.setTheme("sweets")}>Sweets</div>
          <div className="col-1 btn elements-btn-one elements-font-color" onClick={() => this.setTheme("elements")}>Elements</div>
          <div className="col-1 btn noir-btn-one noir-font-color" onClick={() => this.setTheme("noir")}>Noir</div>
        </div>
      );
    }

    setProfilePage(page) {
      let newState = Object.assign({}, this.state);
      newState.pageState = page;
      this.setState(newState);
    }

    navigationButtons() {
      let buttons = [];
      buttons.push({name: "Main Menu", buttonAction: () => this.props.navCallback("main", "")});
      if (this.state.pageState == "profile") {
        if (this.state.user !== this.props.target) {
          buttons.push({name: "Donate", buttonAction: () => this.props.navCallback("donate", this.props.target)});
        } else {
          buttons.push({name: "Donations", buttonAction: () => this.setProfilePage("donations")});
          buttons.push({name: "Workshop", buttonAction: () => this.setProfilePage("workstation")});
        }
      } else {
        buttons.push({name: "Profile", buttonAction: () => this.setProfilePage("profile")});
      }
      return buttons;
    }
    // Scendarios:
    // 1. Own account = display own series, display history, display donations
    // 2. Other account = this account's series
    // Common: Display Reviews.
    // Always show comics created by this profile
    render() {
      return (
        <div className={`${this.state.font} ${this.state.theme}-font-color ${this.state.theme}-bg1`}>
          <div className="row col-12">
            <Tabs buttons={this.navigationButtons()} />
          </div>
          <div className="h2">{this.props.target}</div>
          {this.state.pageState === "profile" && this.state.user === this.props.target && this.addThemeButtons()}
          {this.state.pageState === "profile" && this.state.user === this.props.target && this.addFontButtons()}
          {this.state.pageState === "profile" &&
            <WelcomeMessage theme = {this.state.theme} message = {this.state.message}
              allowEdit = {this.props.target == this.state.user}
              updateMessage = {(message) => this.setUserProperty("message", message)} />
          }
          {this.state.pageState === "profile" && this.state.user === this.props.target &&
            <CreateComic theme = {this.state.theme} navCallback = {(page, target) => this.props.navCallback(page, target)}
          />}
          {this.state.pageState === "profile" &&
            <Comics profileOwner = {this.props.target} showProgress = {false} theme = {this.state.theme}
            visitOwnComic = {(name) => this.props.navCallback("workstation", name)} 
            visitOtherComic = {(name) => this.props.navCallback("reader", name)}
            visitAuthor = {(name) => this.props.navCallback("profile", name)}/>
          }
          {this.state.pageState === "profile" &&
            this.state.user === this.props.target &&
            <Comics profileOwner = {this.props.target} showProgress = {true} theme = {this.state.theme}
            visitOwnComic = {(name) => this.props.navCallback("workstation", name)} 
            visitOtherComic = {(name) => this.props.navCallback("reader", name)}
            visitAuthor = {(name) => this.props.navCallback("profile", name)}/>
          }
          {this.state.pageState === "profile" &&
            <Reviews profileOwner = {this.props.target} theme = {this.state.theme} perUser = {true}
              visitComic = {(name) => this.props.navCallback("reader", name)}
              visitAuthor = {(name) => this.props.navCallback("profile", name)}/>
          }
          {this.state.pageState === "workstation" &&
            <Workstation navCallback = {(page, target) => this.props.navCallback(page, target)}/>
          }
          {this.state.pageState === "donations" &&
            <div className="row">
              <Donations theme={this.state.theme} receivedDonations = {true}
                navCallback = {(page, target) => this.props.navCallback(page, target)}
                returnToProfile = {() => this.setPageState("profile")}/>
              <Donations theme={this.state.theme} receivedDonations = {false}
                navCallback = {(page, target) => this.props.navCallback(page, target)}
                returnToProfile = {() => this.setPageState("profile")}/>
            </div>
          }
        </div>
      );
    }

    async fetchUser() {
      const token = await authService.getAccessToken();
      const requestOptions = {
        method: 'Put',
        headers: {'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
        body: JSON.stringify({ currentProfile : this.props.target})
      }
      const response = await fetch('api/Account/GetUser', requestOptions);
      const data = await response.json();
      this.handleUserResponse(data);
    }

    async setUserProperty(pageOption, valueName) {
      const token = await authService.getAccessToken();
      const requestOptions = {
        method: 'Put',
        headers: {'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
        body: JSON.stringify({ userName : this.state.user, optionName : pageOption, optionValue : valueName })
      }
      const response = await fetch('api/Account/SetUserPage', requestOptions);
      const data = await response.json();
      // Don't do anything
    }
}

export default Profile;