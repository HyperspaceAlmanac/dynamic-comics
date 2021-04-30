import React, { Component } from 'react';
import Tabs from '../Tabs/tabs';
import Comics from '../Comics/comics';
import Reviews from '../Reviews/reviews';
//import Donate from '../Donate/donate'

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
          pageState : "profile",
          theme : "sci-fi",
          user : ""
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

    // If your own profile page
    // Show your reviews, donations, and history. (No comments, those only in series)
    // In workshop, show reviews inside of series.
    // If someone else's page:
    // Show series and reviews
    generatePage() {
      // Add theme buttons
      
      if (this.state.pageState === "profile") {
        return (
          <div>
            <div>row1</div>
            <div>row2</div>
            <div>row3</div>
            <div>{"user: " + this.state.user + ", author: " + this.props.target}</div>
          </div>
          );
      } else if (this.state.pageState === "workshop") {

      } else if (this.state.pageState === "history") {

      } else if (this.state.pageState === "reviews") {

      } else if (this.state.pageState === "donations") {

      } else {
        return (
          <div>
            <div>
              Welcome back. Profile page should do API call to backend, and show these:
            </div>
            <div>
              Navigation bar: Main, Workshop, History, Review, Comments, Donations
              Mix of some of everything above.
            </div>
            <div>Set Theme</div>
            <div>My Series</div>
            <div>Continue Reading</div>
            <div>My Reviews</div>
            <div>Donations</div>
          </div>
        );
      }
    }

    navigationButtons() {
      let buttons = [];
      buttons.push({name: "Back", buttonAction: () => this.props.navCallback("main", "")});
      if (this.state.user !== this.props.target) {
        buttons.push({name: "Donate", buttonAction: () => this.props.navCallback("donate", this.props.target)});
      }
      return buttons;
    }
    // Scendarios:
    // 1. Own account = display own series, display history, display donations
    // 2. Other account = this account's series
    // Common: Display Reviews.
    // Always show comics created by this profile
    render() {
      console.log(this.props);
      return (
        <div>
          <div className="row col-12">
            <Tabs buttons={this.navigationButtons()} />
          </div>
          {this.addThemeButtons()}
          <Comics profileOwner = {this.props.target} showProgress = {false}
            visitOwnComic = {(name) => this.props.navCallback("workstation", name)} 
            visitOtherComic = {(name) => this.props.navCallback("reader", name)}
            visitAuthor = {(name) => this.props.navCallback("profile", name)}/>

          {this.state.user === this.props.target &&
            <Comics profileOwner = {this.props.target} showProgress = {true}
            visitOwnComic = {(name) => this.props.navCallback("workstation", name)} 
            visitOtherComic = {(name) => this.props.navCallback("reader", name)}
            visitAuthor = {(name) => this.props.navCallback("profile", name)}/>
          }
          <Reviews profileOwner = {this.props.target}
            visitComic = {(name) => this.props.navCallback("reader", name)}
            visitAuthor = {(name) => this.props.navCallback("profile", name)}/>
        </div>
      );
    }
    
    
    fetchDonations() {

    }
    fetchReviews() {

    }
}

export default Profile;