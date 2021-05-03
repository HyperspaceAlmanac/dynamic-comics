import React from "react";
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import authService from '../api-authorization/AuthorizeService';
import './donate.css';

// minimal example from react.stripes.js documentation
const CheckoutForm = ({author, amount}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement);

    // Use your card Element with other Stripe.js APIs
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.log('[error]', error);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
      // Do API call to backend here

      const token = await authService.getAccessToken();
        const requestOptions = {
            method: 'Put',
            headers: {'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
            body: JSON.stringify({ user : author })
        }
        // In case user continues typing and it becomes something different
        const response = await fetch('api/Account/MakeDonation', requestOptions);
        const data = await response.json();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>{`Donation of $${amount} to ${author}`}</div>
      <CardElement />
      <button type="submit" disabled={!stripe} className="btn btn-primary">
        Confirm Payment
      </button>
    </form>
  );
};

export default CheckoutForm;