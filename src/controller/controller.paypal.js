const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
})

const paypalCheckout = async (req, res) => {
    try {
      const { amount } = req.body;
  
      const result = await gateway.clientToken.generate({});
  
      if (!result.success) {
        return res.status(500).json({ error: 'Failed to generate client token' });
      }
  
      const checkoutRequest = {
        amount: amount,
        paymentMethodNonce: "fake-valid-nonce",
        options: {
          submitForSettlement: true,
          paypal: {
            intent: "sale"
          },
          applePay: {
            total: {
              label: 'Your Store',
              amount: amount
            }
          },
          googlePay: {
            total: {
              label: 'Your Store',
              amount: amount
            }
          }
        }
      };
  
      const transactionResult = await gateway.transaction.sale(checkoutRequest);
  
      if (transactionResult.success) {
        res.redirect(transactionResult.transaction.paymentUrl);
      } else {
        res.status(500).json({ error: transactionResult.message });
      }
    } catch (error) {
        console.log("an error occured:", error);
        return res.status(500).json({ message: "an error occured", details: error.message})
    }
  };

module.exports = {
    paypalCheckout
}