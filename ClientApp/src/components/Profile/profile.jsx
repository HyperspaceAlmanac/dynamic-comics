import React, { Component } from 'react';
import Tabs from '../Tabs/tabs';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
          pageState : "profile",
        }
      }
    setPageState(pageState) {
      let newState = Object.assign({}, this.state);
      newState.pageState = pageState;
      this.setState(newState);
    }

    generatePage() {
      let values = [];
      if (this.state.pageState == "profile") {

      } else if (this.state.pageState == "workshop") {

      } else if (this.state.pageState == "history") {

      } else if (this.state.pageState == "reviews") {

      } else if (this.state.pageState == "comments") {

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
    }

    navigationButtons() {
      let buttons = [];
      buttons.push({name: "Back", buttonAction: () => this.props.navCallback("main", ""),});
      return buttons;
    }
    render() {
      console.log(this.props);
      return (
        <div>
          <div>Themes</div>
          <div className="row col-12">
            <Tabs buttons={this.navigationButtons()} />
          </div>

          {this.generatePage()}
        </div>
      );
    }
}

export default Profile;