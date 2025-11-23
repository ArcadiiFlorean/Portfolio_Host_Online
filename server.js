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
    const { amount, packageName, email } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
  amount: amount,
  currency: 'gbp',  // ⭐ Schimbă din 'ron' în 'gbp'
  description: packageName || 'Package purchase',
  receipt_email: email || undefined,
  automatic_payment_methods: {
    enabled: true,
  },
});
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`💳 Stripe Payment Integration Active`);
});
