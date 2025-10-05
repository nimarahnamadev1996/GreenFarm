"use server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


export const getStripePaymentIntentToken = async (amount: number) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount* 100,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      description : 'Payment for Shey-Organic-Foods',
    });

    return {
      success: true,
      data: paymentIntent.client_secret,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};