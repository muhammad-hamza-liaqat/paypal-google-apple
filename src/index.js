const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express()
require("dotenv").config();
const { logger, logRequestDuration } = require("./utils/logger");


// middleware config
app.use(express.json());
app.use(bodyParser.raw({ type: 'application/json' }));
app.use(cors());
app.use(logRequestDuration);

// winston middleware Added.
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

const paypalRoutes = require("./routes/routes.paypal");
app.use("/api", paypalRoutes);


app.listen(process.env.PORT, () => {
  console.log(`server is running at http://${process.env.PORT}/`)
})