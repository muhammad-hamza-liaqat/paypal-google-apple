const express = require("express");
const { paypalCheckout } = require("../controller/controller.paypal");
const paypalRoutes = express.Router();

paypalRoutes.post("/checkout",paypalCheckout);


module.exports = paypalRoutes