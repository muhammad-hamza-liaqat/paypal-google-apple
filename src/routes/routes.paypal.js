const express = require("express");
const { paypalCheckout, generateClientToken } = require("../controller/controller.paypal");
const paypalRoutes = express.Router();

paypalRoutes.post("/checkout", paypalCheckout);
paypalRoutes.post("/token", generateClientToken);


module.exports = paypalRoutes