import React, { Component } from 'react';
import Tabs from '../Tabs/tabs';
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
    }

    addThemeButtons(values) {
      values.push(
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
    addSeries(values) {
    }

    addComments(values) {

    }

    addReviews(values) {

    }
    
    addDonations(values) {

    }

    addHistory(values) {

    }
    // If your own profile page
    // Show your reviews, donations, and history. (No comments, those only in series)
    // In workshop, show reviews inside of series.
    // If someone else's page:
    // Show series and reviews
    generatePage() {
      let values = [];
      // Add theme buttons
      this.addThemeButtons(values);
      
      if (this.state.pageState == "profile") {
        values.push(<div>row1</div>);
        values.push(<div>row2</div>);
        values.push(<div>row3</div>);
      } else if (this.state.pageState == "workshop") {

      } else if (this.state.pageState == "history") {

      } else if (this.state.pageState == "reviews") {

      } else if (this.state.pageState == "donations") {

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
            <div>My Comments</div>
            <div>Donations</div>
          </div>
        );
      }
      values.push(<div>{"user: " + this.state.user + ", author: " + this.props.target}</div>)
      return values;
    }

    navigationButtons() {
      let buttons = [];
      buttons.push({name: "Back", buttonAction: () => this.props.navCallback("main", "")});
      if (this.state.user !== this.props.target) {
        buttons.push({name: "Donate", buttonAction: () => this.props.navCallback("donate", this.props.target)});
      }
      return buttons;
    }
    render() {
      console.log(this.props);
      return (
        <div>
          <div className="row col-12">
            <Tabs buttons={this.navigationButtons()} />
          </div>
          {this.generatePage()}
        </div>
      );
    }
    fetchOwnSeries() {

    }
    fetchHistory() {

    }
    fetchDonations() {

    }
    fetchComments() {

    }
}

export default Profile;