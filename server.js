const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/charge', async (req, res) => {
  const { amount, token } = req.body;

  try {
    const charge = await stripe.charges.create({
      amount,
      currency: 'usd',
      source: token,
      description: 'Charge for test@example.com',
    });

    res.send('Payment successful');
  } catch (err) {
    console.error('Error processing payment:', err);
    let message = 'An error occurred while processing your payment.';

    if (err.type === 'StripeCardError') {
      message = err.message;
    }

    res.status(500).send(message);
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
