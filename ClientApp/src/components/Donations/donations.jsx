import React, { Component } from 'react';
import Tabs from '../Tabs/tabs';
import './donations.css';

class Donations extends Component {
    constructor(props) {
        super(props);
        this.state = {
          donations : [],
          sorting: "recent",
          filterName: ""
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.fetchDonations();
    }

    handleChange(event) {
        let newState = Object.assign({}, this.state);
        newState[event.target.name] = event.target.value;
        this.setState(newState);
    }

    sortCriteria(criteria) {
        let newState = Object.assign({}, this.state);
        newState.sorting = criteria;
        this.setState(newState);
    }

    cancelDonation(id) {
        let result = this.fetchCancelDonation(id);
        if (result) {
            alert("Donation successfully cancelled!");
            this.props.returnToProfile();
        }
    }
    returnYes(value) {
        return true;
    }
    sortDonations() {
        let shallowCopy = [...this.state.donations];
        // Check filter first
        if (this.state.filterName !== "") {
          shallowCopy = shallowCopy.filter(
            entry => {
                return this.props.receivedDonations ?
                entry.customer.toLowerCase().includes(this.state.filterName.toLowerCase())
                : entry.artist.toLowerCase().includes(this.state.filterName.toLowerCase())
            });
        }
        console.log("Donations filter: " + this.state.filterName);
        console.log(shallowCopy);
        if (this.state.sorting === "recent") {
          shallowCopy.sort((a, b) => {
            if (a.date > b.date) {
              return -1;
            }
            if (a.date < b.date) {
              return 1;
            }
            return 0;
          });
  
        } else if (this.state.sorting === "amount") {
          shallowCopy.sort((a, b) => {
            if (a.amount > b.amount) {
              return -1;
            }
            if (a.amount < b.amount) {
              return 1;
            }
            return 0;
          });
        }
        let donations = [];
        for (let i = 0; i < shallowCopy.length; i++) {
          donations.push(
          <div className="row-6" key={i} >
              <div>{this.props.receivedDonations ? "From: " + shallowCopy[i].customer : "To: " + shallowCopy[i].artist}</div>
              <div>{"$" + shallowCopy[i].amount}</div>
              <div>{shallowCopy[i].date}</div>
              <div>{shallowCopy[i].comment}</div>
              {!this.props.receivedDonations &&
                <div className="btn btn-primary" onClick={() => this.cancelDonation(shallowCopy[i].transactionId)}>Cancel</div>}
          </div>);
        }
        return donations;
      }
  

    addButtons() {
        let buttons = [];
        buttons.push({name: "Most Recent", buttonAction : () => this.sortCriteria("recent"), width: "col-6"});
        buttons.push({name: "Amount", buttonAction : () => this.sortCriteria("amount"), width: "col-6"});
        return buttons;
      }
      //style={{overflowY : 'scroll', height: window.innerHeight}}
    render() {
        return(
            <div className="col-6 vertical-overflow">
               <div className="col-12">{this.props.receivedDonations ? "Received Donations:" : "Your Donations:"}</div>
               <Tabs buttons={this.addButtons()}/>
               <form className="row col-12">
                    <span className="col-4">Search by Name:  </span>
                    <input className="col-6" type="text" name="filterName" value={this.state.filterName}
                    onChange={this.handleChange} />
                </form>
               {this.sortDonations()}
            </div>
        );
    }
    fetchDonations() {
      let donations = [];
      for (let i = 0; i < 10; i++) {
        if (this.props.receivedDonations) {
            donations.push({artist : "MagicalPaintBrush", customer :  "Patron " + i, amount : 2 * i + 10, date : Date(), comment : "Love your work!", transactionId : 1000 +i});
            donations.push({artist : "MagicalPaintBrush", customer :  "Patron " + i, amount : 2 * i + 10, date : Date(), comment : "Love your work!", transactionId : 2000 +i});
        } else {
            donations.push({artist : "Good Artist" + i, customer : "MagicalPaintBrush", amount : 2 * i + 10, date : Date(), comment : "Love your work!", transactionId : 3000 + i});
        }
      }
      let newState = Object.assign({}, this.state);
      newState.donations = donations;
      this.setState(newState);
    }

    fetchCancelDonation(id) {
        // API call
        return true;
    }
}

export default Donations;