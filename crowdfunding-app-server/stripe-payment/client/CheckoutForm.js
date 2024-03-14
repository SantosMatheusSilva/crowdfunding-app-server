import { useEffect, useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';


const CheckoutForm = () =>{
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event) =>{
        event.preventDefault();
        if(!stripe || elements){
            return;
        }
        setIsProcessing(true);
        
        // here we handle the payment confirmation 
        const {error, paymentIntent} = await stripe.confirmPayment({
            elements,
            confirmParams:{
                // this the redirection when the payment is completed successfully
                return_url: `${window.location.origin}/completion`,
           },
           redirect: 'if_required',
        })
        if(error){
            setMessage(error.message);   
        } else if(paymentIntent && paymentIntent.status === 'succeeded') {
            setMessage('Payment status:', + paymentIntent.status + '💵 DONE 💳')
        }else{
            setMessage('Unexpected state')
        }
        setIsProcessing(false);
        
    }
    return(
        <form id='payment-form' onSubmit={handleSubmit}>
            <PaymentElement/>
            <button id='submit' disabled={isProcessing}>
                <span>
                    {isProcessing? 'Processing...' : 'Pay now'}
                </span>
            </button>
            {/* Show any error or success  messages */}
            {}

        </form>
    )
}