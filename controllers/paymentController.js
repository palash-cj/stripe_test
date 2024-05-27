const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;


const stripe = require('stripe')("sk_test_51PEVC3SJ3MorEbHb7XIrurg9cia8mcWRRf78VJxwf7Kwo9NtozaRc0B10EeXBoMmYXA2EuUrnPHAx7o7Prbmucbc00yMkAUAUB")

const renderBuyPage = async(req,res)=>{

    try {
        
        res.render('index', {
            key: "",
            amount:25
         })

    } catch (error) {
        console.log(error.message);
    }

}

const payment = async(req,res)=>{

    try {

    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Sandeep Sharma',
        address: {
            line1: '115, Vikas Nagar',
            postal_code: '281001',
            city: 'Mathura',
            state: 'Uttar Pradesh',
            country: 'India',
        }
    })
    .then((customer) => {
 
        return stripe.charges.create({
            amount: req.body.amount,     // amount will be amount*100
            description: req.body.productName,
            currency: 'INR',
            customer: customer.id
        });
    })
    .then((charge) => {
        console.log(charge, 46)
        res.redirect("/success")
    })
    .catch((err) => {
        console.log(err, 50);
        res.redirect("/failure")
    });


    } catch (error) {
        console.log(error, 56);
        console.log(error.message);
    }

}

const success = async(req,res)=>{

    try {
        
        res.render('success');

    } catch (error) {
        console.log(error.message);
    }

}

const failure = async(req,res)=>{

    try {
        
        res.render('failure');

    } catch (error) {
        console.log(error.message);
    }

}

const charge = async (req, res) => {
    const { amount, token } = req.body;
    console.log(amount, token, 89);

    const lineItems = [{
        price_data: {
            currency: "usd",
            product_data: {
                name: "Twin Points",
                images: ["https://res.cloudinary.com/dvogrko4j/image/upload/v1706768807/wkpmqtj8ojbo8irnisrk.png"]
            },
            unit_amount: 100
        },
        quantity: 2
    }];

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/failure"
        });
        console.log(session);
        res.send(session);
    } catch (err) {
        console.error('Error processing payment:', err.message);
        let message = 'An error occurred while processing your payment.';

        if (err.type === 'StripeCardError') {
            message = err.message;
        }

        res.status(500).send(message);
    }
}

const webhook = async (req, res) => {
    console.log(126);
    
    const payload = `${req.body}`;
    const endpointSecret = 'whsec_SKsCJLYoKs8e9PeM8u1fBu6XWVeESkNZ'; // webhook key
    const sig = req.headers['stripe-signature'];
    console.log(sig, 132);
    
    let event;
    
    try {
        console.log(137);
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
        console.log(event, 133);
    } catch (err) {
        console.log(err);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          console.log('PaymentIntent was successful!');
          break;
        case 'payment_method.attached':
          const paymentMethod = event.data.object;
          console.log('PaymentMethod was attached to a Customer!');
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    
      // Return a response to acknowledge receipt of the event
    res.json({received: true});
     
}

module.exports = {
    renderBuyPage,
    payment,
    success,
    failure,
    charge,
    webhook
}