import React, { Component } from 'react';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./checkoutForm";

const stripePromise = loadStripe("pk_test_51IYBRaIA0hLVSbphflOwHb6VZqwN4at3SyOb9QtTK7i8FwXeBp7OKETjTskQsYDEAZxAuQqRzbynz0ZOjWk5U6sB00h30v7vc4");
class Donate extends Component {

    constructor(props) {
        super(props);
      }
    render() {
        return (
            <div>
                <div className="btn btn-primary" onClick={() => this.props.navCallback("main", "")}>Back to Main Page</div>
                <div>{"Donate to " + this.props.author}</div>
              <div>
                <div>
                  <Elements stripe={stripePromise}>
                    <CheckoutForm />
                  </Elements>
                </div>
              </div>
            </div>
          );
    }
}

export default Donate;