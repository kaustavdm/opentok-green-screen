/**
 * OpenTok-Green-Screen main server script
 *
 * This script starts the application server by mounting all the
 * necessary routes, loading configuration and creating a handler to
 * OpenTok's server side SDK.
 */

// Load dependencies -----------------------------
const express = require("express");
const opentok = require("opentok");
const bodyparser = require("body-parser");

const storage = require("./libs/storage");
const utils = require("./libs/utils");

// Load config from file & merge with env vars ---
let config = utils.load_config(process.env.PWD);

// Setup OpenTok ---------------------------------
const OT = new opentok(config.opentok.api_key, config.opentok.api_secret);

// Setup storage
let db = new storage(config.app.storage_dir);

// Create app instance ---------------------------
let app = express();

// Enable body-parser ----------------------------
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// Security measures -----------------------------
app.disable("x-powered-by");

// Set view engine -------------------------------
app.set("view engine", "ejs");

// Mount middlewares -----------------------------
app.use((req, res, next) => {
  req.config = config;          // Add config
  req.OT = OT;                  // Add OpenTok SDK instance
  req.db = db;                  // Add db connection
  req.utils = utils;            // Add utility functions
  next();
});

// Mount routes ----------------------------------;

// Mount homepage route
app.get("/", (req, res) => {
  res.render("home");
});

// Mount API routes
app.use("/api", require("./api"));

// Handler for Call pages
app.get("/call/:id", (req, res) => {
  res.render("call", { call_id: req.params.id });
});

// Mount the `./assets` dir to web-root as static.
app.use("/", express.static("./assets"));


// Start server ----------------------------------
let port = config.app.port || 8080;

if (!config.ssl.enabled) {
  // Start as Non-ssl
  app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });
} else {
  // Start as SSL
  const https = require("https");
  const fs = require("fs");
  const https_options = {
    key: fs.readFileSync(config.ssl.key),
    cert: fs.readFileSync(config.ssl.cert),
    passphrase: config.ssl.passphrase
  };
  https.createServer(https_options, app).listen(port, () => {
    console.log(`Listening on secure port ${port}...`);
  });
}
