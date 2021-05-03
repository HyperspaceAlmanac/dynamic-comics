'use strict';
import React, { Component } from 'react';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./checkoutForm";
import './donate.css';

const stripePromise = loadStripe("pk_test_51IYBRaIA0hLVSbphflOwHb6VZqwN4at3SyOb9QtTK7i8FwXeBp7OKETjTskQsYDEAZxAuQqRzbynz0ZOjWk5U6sB00h30v7vc4");
class Donate extends Component {

    constructor(props) {
        super(props);

        this.state = {
          amount : "1.00",
          status : "settingAmount",
          message : "",
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    numberCheck() {
      let num = this.state.amount;
      if (isNaN(num)) {
        return false;
      }
      if (parseFloat(num) < 1) {
        return false;
      }
      let index = num.indexOf(".");
      if (index !== -1) {
        if (num.length - index !== 3) {
          return false;
        }
      } else {
        return false;
      }
      return true;
    }

    handleChange(event) {
      let value = event.target.value;
      if (event.target.value.length > 200) {
        value = value.substring(0, 200);
      }
      let newState = Object.assign({}, this.state);
      newState[event.target.name] =  value;
      this.setState(newState);
    }

    backButton() {
      let newState = Object.assign({}, this.state);
      newState.status = "settingAmount";
      this.setState(newState);
    }

    handleSubmit(event) {
      event.preventDefault();
      if (this.numberCheck()) {
        let newState = Object.assign({}, this.state);
        newState.status = "pay";
        this.setState(newState);
      } else {
        alert("Invalid or Misformatted Donation Amount!")
      }
  }

    render() {
      if (this.state.status === "settingAmount") {
        return (
            <div>
                <div className="btn btn-primary" onClick={() => this.props.navCallback("main", "")}>Back to Main Page</div>
                <div>{"Donate to " + this.props.author}</div>
                <form onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="col-md-4">
                            <label>Amount($1.00 minimum):</label>
                            <div>$<input type="text" name="amount" value={this.state.amount}
                            onChange={this.handleChange} /></div>
                            {!this.numberCheck()
                            && <div className="text-danger">Should be in $x.xx Format)</div>}
                        </div>
                        <br/>
                        <div className="col-md-6">
                            <label>Message(200 characters limit):</label>
                            <textarea className="col-md-10 larger-box" type="text" name="message" value={this.state.message}
                            onChange={this.handleChange} />
                        </div>
                        <br/>
                        <div className="col-md-2">
                            <input className="btn btn-primary" type="submit" value="Pay" />
                        </div>
                    </div>
                </form>
            </div>
          );
      } else {
        return (
          <div>
            <div className="btn btn-info" onClick = {() => this.backButton()}>Update Amount or Message</div>
            <Elements stripe={stripePromise}>
              <CheckoutForm author={this.props.author} amount={this.state.amount} message= {this.state.message} />
            </Elements>
          </div>
        );
      }
    }
}

export default Donate;