/**
 * Route handler for API
 */

let router = require("express").Router();

router.use("/session", require("./session"));

// Export the router
module.exports = router;
