require("dotenv").config();
const express = require("express");
const cors = require("cors");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Stripe Payment Server is running! 🚀" });
});

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, email, description } = req.body;

    if (!amount || !email) {
      return res.status(400).json({ error: "Amount and email are required" });
    }

    if (amount < 50) {
      return res.status(400).json({ error: "Minimum amount is £0.50" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: "gbp",
      receipt_email: email,
      description: description || "Payment",
      metadata: {
        email: email,
        description: description || "Payment",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`💳 Stripe Payment Integration Active`);
});
