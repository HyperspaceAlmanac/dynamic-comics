import React from "react";
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import authService from '../api-authorization/AuthorizeService';
import './donate.css';

const CheckoutForm = ({author, amount, message}) => {
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
      console.log(result.error.message);
    } else {
      console.log("Created Token!");
      console.log(result.token);

      const token = await authService.getAccessToken();
        const requestOptions = {
            method: 'Put',
            headers: {'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
            body: JSON.stringify({ user : author, tokenId : result.token.id, message : message, amount : amount})
        }
        const response = await fetch('api/Account/MakeDonation', requestOptions);
        const data = await response.json();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>{`Donation of $${amount} to ${author}`}</div>
      <div>{`Message: ${message}`}</div>
      <CardElement />
      <button type="submit" disabled={!stripe} className="btn btn-primary">
        Confirm Payment
      </button>
    </form>
  );
};

export default CheckoutForm;