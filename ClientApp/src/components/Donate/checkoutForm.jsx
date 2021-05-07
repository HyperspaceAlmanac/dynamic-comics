'use strict';
import React from "react";
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import authService from '../api-authorization/AuthorizeService';
import './donate.css';

const CheckoutForm = ({author, amount, message, mainPage}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }


    const card = elements.getElement(CardElement);

    const result = await stripe.createToken(card);
    if (result.error) {
      alert("Unable to process the request. Please try again later.");
    } else {

      const token = await authService.getAccessToken();
      const requestOptions = {
          method: 'Put',
          headers: {'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
          body: JSON.stringify({ user : author, tokenId : result.token.id, message : message, amount : amount})
      }
      const response = await fetch('api/Account/MakeDonation', requestOptions);
      const data = await response.json();
      alert("Donation successfully processed! Redirecting back to home page");
      mainPage();
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <div className="h4">{`Donation of $${amount} to ${author}`}</div>
      <div className="h4">Message:</div>
      <div className="h5">{`${message}`}</div>
      <br/>
      <div className="h4">Please Enter Credit Card Info</div>
      <div className="col-6">
        <CardElement />
      </div>
      <br/>
      <button type="submit" disabled={!stripe} className="btn btn-primary">
        Confirm Payment
      </button>
    </form>
  );
};

export default CheckoutForm;