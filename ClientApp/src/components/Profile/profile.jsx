import React, { Component } from 'react';
import Tabs from '../Tabs/tabs';
import Comics from '../Comics/comics';
import Reviews from '../Reviews/reviews';
import Donations from '../Donations/donations';
import Workstation from '../Workstation/workstation';
import './profile.css';
class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
          pageState : "profile",
          theme : "sci-fi",
          user : "",
          font : "arial"
        }
      }
    setPageState(pageState) {
      let newState = Object.assign({}, this.state);
      newState.pageState = pageState;
      this.setState(newState);
    }

    componentDidMount() {
      // Something here
      let newState = Object.assign({}, this.state);
      newState.user = "MagicalPaintBrush";
      this.setState(newState);
      console.log("Profile mounted");
    }

    getThemeArray() {
      
    }

    setFont(font) {
      let newState = Object.assign({}, this.state);
      newState.font = font;
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
          <div className="col-1 btn btn-primary">Sci-fi</div>
          <div className="col-1 btn btn-secondary">Dystopian</div>
          <div className="col-1 btn btn-success">Nature</div>
          <div className="col-1 btn btn-danger">Danger</div>
          <div className="col-1 btn btn-dark">Noir</div>
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
      console.log("Navigation buttons");
      console.log(buttons);
      return buttons;
    }
    // Scendarios:
    // 1. Own account = display own series, display history, display donations
    // 2. Other account = this account's series
    // Common: Display Reviews.
    // Always show comics created by this profile
    render() {
      console.log("Render profile");
      console.log(this.props);
      console.log(this.state);
      return (
        <div className={this.state.font}>
          <div className="row col-12">
            <Tabs buttons={this.navigationButtons()} />
          </div>
          {this.state.pageState === "profile" && this.state.user === this.props.target && this.addThemeButtons()}
          {this.state.pageState === "profile" && this.state.user === this.props.target && this.addFontButtons()}
          {this.state.pageState === "profile" &&
            <Comics profileOwner = {this.props.target} showProgress = {false}
            visitOwnComic = {(name) => this.props.navCallback("workstation", name)} 
            visitOtherComic = {(name) => this.props.navCallback("reader", name)}
            visitAuthor = {(name) => this.props.navCallback("profile", name)}/>
          }
          {this.state.pageState === "profile" &&
            this.state.user === this.props.target &&
            <Comics profileOwner = {this.props.target} showProgress = {true}
            visitOwnComic = {(name) => this.props.navCallback("workstation", name)} 
            visitOtherComic = {(name) => this.props.navCallback("reader", name)}
            visitAuthor = {(name) => this.props.navCallback("profile", name)}/>
          }
          {this.state.pageState === "profile" &&
            <Reviews profileOwner = {this.props.target}
              visitComic = {(name) => this.props.navCallback("reader", name)}
              visitAuthor = {(name) => this.props.navCallback("profile", name)}/>
          }
          {this.state.pageState === "workstation" &&
            <Workstation navCallback = {(page, target) => this.props.navCallback(page, target)}/>
          }
          {this.state.pageState === "donations" &&
            <div className="row">
              <Donations receivedDonations = {true}
                navCallback = {(page, target) => this.props.navCallback(page, target)}
                returnToProfile = {() => this.setPageState("profile")}/>
              <Donations receivedDonations = {false}
                navCallback = {(page, target) => this.props.navCallback(page, target)}
                returnToProfile = {() => this.setPageState("profile")}/>
            </div>
          }
        </div>
      );
    }
}

export default Profile;