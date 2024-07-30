const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

const paypalCheckout = async (req, res) => {
  try {
    const { amount, paymentMethodNonce } = req.body;
    if (!amount || !paymentMethodNonce) {
      return res.status(400).json({ message: "Required fields are missing!" });
    }

    const result = await gateway.clientToken.generate({});
    if (!result.success) {
      return res.status(500).json({ error: 'Failed to generate client token' });
    }

    const checkoutRequest = {
      amount: amount,
      paymentMethodNonce: paymentMethodNonce,
      options: {
        submitForSettlement: true,
      }
    };

    const transactionResult = await gateway.transaction.sale(checkoutRequest);
    if (transactionResult.success) {
      res.status(200).json({ message: 'Transaction successful', transaction: transactionResult.transaction });
    } else {
      res.status(500).json({ error: transactionResult.message });
    }
  } catch (error) {
    console.log("An error occurred:", error);
    return res.status(500).json({ message: "An error occurred", details: error.message });
  }
};

module.exports = {
  paypalCheckout,
};
