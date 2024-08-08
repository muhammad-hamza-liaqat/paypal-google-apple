const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");
const app = express();
require("dotenv").config();
const { logger, logRequestDuration } = require("./utils/logger");

app.use(express.json());
app.use(bodyParser.raw({ type: 'application/json' }));
app.use(cors());
app.use(logRequestDuration);

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

const paypalRoutes = require("./routes/routes.paypal");
app.use("/api", paypalRoutes);

let sitemap;
app.get('/sitemap.xml', async (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.header('Content-Encoding', 'gzip');

  if (!sitemap) {
    try {
      const smStream = new SitemapStream({ hostname: `http://localhost:${process.env.PORT}/` });
      const pipeline = smStream.pipe(createGzip());

      // smStream.write({ url: '/', changefreq: 'always', priority: 1.0 });
      smStream.write({ url: 'http://localhost:3000/api/checkout', changefreq: 'daily', priority: 0.8 });
      smStream.write({ url: 'http://localhost:3000/api/token', changefreq: 'monthly', priority: 0.5 });
      // smStream.write({ url: '/api/token', changefreq: 'monthly', priority: 0.5 });

      smStream.end();

      const data = await streamToPromise(pipeline);
      sitemap = data;
      res.send(data);
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  } else {
    res.send(sitemap);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`server is running at http://localhost:${process.env.PORT}/`);
});
