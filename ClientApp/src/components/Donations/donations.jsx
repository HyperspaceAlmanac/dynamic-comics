'use strict';
import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import Tabs from '../Tabs/tabs';
import './donations.css';
import '../themes.css';
import { isThisTypeNode } from 'typescript';

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
    formatAmount(amount) {
      let total = amount;
      let stripeCut = total * 0.029 + 0.30;
      let platformCut = Math.max(total * 0.05 - 0.30, 0.1);
      let artistAmount = total - stripeCut - platformCut;
      return `Processing Fees: $${stripeCut.toFixed(2)}, Platform Maintenance: $${platformCut.toFixed(2)}`;
    }

    artistCut(amount) {
      let total = amount;
      let stripeCut = total * 0.029 + 0.30;
      let platformCut = Math.max(total * 0.05 - 0.30, 0.1);
      let artistAmount = total - stripeCut - platformCut;
      return artistAmount;
    }
    calculateTotal() {
      let result = 0.0;
      let donation;
      for (let i = 0; i < this.state.donations.length; i++) {
        donation = this.state.donations[i];
        result += this.artistCut(donation.amount);
      }
      return "$" + result.toFixed(2);
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
              <div className="h4">{this.props.receivedDonations ? "From: " + shallowCopy[i].customer : "To: " + shallowCopy[i].artist}</div>
              <div className="h5">{`Donation Amount: $${shallowCopy[i].amount.toFixed(2)}`}</div>
              {this.props.receivedDonations &&
                <div>{"Amount added to account: $" + this.artistCut(shallowCopy[i].amount).toFixed(2)}</div>
              }
              {this.props.receivedDonations &&
               <div> {this.formatAmount(shallowCopy[i].amount)} </div>
              }
              <div>{shallowCopy[i].date}</div>
              <div className="h4">{shallowCopy[i].comment}</div>
              <br/>
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
        <div className= {(this.props.receivedDonations ? `${this.props.theme}-bg1` : `${this.props.theme}-bg2`) + " col-6 vertical-overflow"}>
            <div className="col-12 h3">{this.props.receivedDonations ? "Received Donations:" : "Your Donations:"}</div>
            {this.props.receivedDonations &&
            <div className="h3">{"Total amount on account: " + this.calculateTotal()}</div>
            }
            <Tabs buttons={this.addButtons()}/>
            <br/>
            <form className="row col-12">
                <span className="col-4">Search by Name:  </span>
                <input className="col-6" type="text" name="filterName" value={this.state.filterName}
                onChange={this.handleChange} />
            </form>
            {this.state.donations.length > 0 &&
              this.sortDonations()
            }
        </div>
      );
    }
    async fetchDonations() {
      const token = await authService.getAccessToken();
        let requestParam = this.props.showProgress ? "history" : "partial";
        const requestOptions = {
            method: 'Put',
            headers: {'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
            body: JSON.stringify({ receivedDonations : this.props.receivedDonations })
        }
        // In case user continues typing and it becomes something different
        const response = await fetch('api/Account/GetDonations', requestOptions);
        const data = await response.json();
        if (data.result === "Success") {
          let newState = Object.assign({}, this.state);
          newState.donations = data.donations;
          this.setState(newState);
        } else {
          alert("Something went wrong with donations");
        }
    }
}

export default Donations;