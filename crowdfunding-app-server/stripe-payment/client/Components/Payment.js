// this component will handle the payment system for us and link the stripe

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../CheckoutFrom";
import { Elements } from "@stripe/react-stripe-js";

const Payment = () => {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

  // here we get the client secret and store it in a hook, so we can use to initializa elements
  // now we havee to creatre the pauyment intent in the backend
  const [clientSecreet, setClientSecreet] = useState("");

  useEffect(() => {
    // Aqui pegamos a key vinda to backend
    fetch("/config").then(async (res) => {
      const { publishableKey } = await res.json();
      //
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  useEffect(() => {
    // here we do a post request to make a payment intent
    fetch("/create-payment-intent", {
      method: "POST",
      body: JSON.stringify({}),
    }).then(async (res) => {
      const { clientSecret } = await res.json();
      //
      setClientSecret(clientSecret);
    });
  }, []);

  return (
    <>
      <h1> React Stripe and Payment Element </h1>
      {stripePromise && clientSecreet && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
};

export default Payment;
