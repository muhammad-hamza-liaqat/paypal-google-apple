const braintree = require("braintree");
const gateway = require("../config/brainTree.config");


const generateClientToken = async (req, res) => {
  try {
    const response = await gateway.clientToken.generate({});
    res.send(response.clientToken);
  } catch (err) {
    res.status(500).send(err);
  }
};


const paypalCheckout = async (req, res) => {
  const nonceFromTheClient = req.body.paymentMethodNonce;
  const amount = req.body.amount;

  try {
    const result = await gateway.transaction.sale({
      amount: amount,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
        storeInVaultOnSuccess: true

      },
    });

    if (result.success) {
      return res.send(result);
    } else {
      return res.status(500).send(result.message);
    }
  } catch (err) {
    console.error("error ------------------------->", err.message)
    return res.status(500).json({ message: "internal server error", error: err.message });
  }
};



module.exports = {
  paypalCheckout,
  generateClientToken
};
