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
          amount : 1.0,
          status : "settingAmount"
        }
    }
    render() {
        return (
            <div>
                <div className="btn btn-primary" onClick={() => this.props.navCallback("main", "")}>Back to Main Page</div>
                <div>{"Donate to " + this.props.author}</div>
              <div>
                <div>
                  <Elements stripe={stripePromise}>
                    <CheckoutForm author={this.props.author} amount={this.state.amount}/>
                  </Elements>
                </div>
              </div>
            </div>
          );
    }
}

export default Donate;