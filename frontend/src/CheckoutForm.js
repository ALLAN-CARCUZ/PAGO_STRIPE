// CheckoutForm.js
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './CheckoutForm.css';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const cardElement = elements.getElement(CardElement);

    // Llamada a tu backend para crear el PaymentIntent
    const response = await fetch('http://localhost:5000/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: 1000 }), // Monto en centavos
    });

    const { clientSecret } = await response.json();

    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Pago exitoso');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <CardElement className="card-element" />
      <button type="submit" disabled={!stripe} className="submit-button">
        Pagar
      </button>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </form>
  );
};

export default CheckoutForm;