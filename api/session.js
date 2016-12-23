/**
 * Endpoints for OpenTok Session
 */

let router = require("express").Router(),
    crypto = require("crypto");

/**
 * Webinar middleware to fetch call info
 */
let load_call = (req, res, next) => {
  let c = req.db.get("calls", req.params.id);
  if (c === null) {
    req.utils.error_res(res, 404, "Call not found");
    return;
  }
  req.call_data = c;
  next();
};

/**
 * Generate slug
 *
 * @returns {String} A 7-character slug, hyphenated in between.
 */
let create_slug = () => {
  var id = crypto.randomBytes(3).toString("hex");
  return [id.slice(0, 3), id.slice(3)].join("-");
};

/**
 * Handler for creating session and registering OpenTok session ID
 */
router.get("/create", (req, res) => {
  let slug = req.query.slug || create_slug();
  // Create session in OpenTok
  req.OT.createSession({ mediaMode: "routed" }, function (err, session) {
    if (err) {
      console.log("Error", err);
      req.utils.error_res(res, 500, "Unable to create session.");
      return;
    }
    try {
      req.db.put("calls", slug, {
        id: slug,
        ot_session_id: session.sessionId
      });
    } catch (e) {
      console.log("Error", e);
      req.utils.error_res(res, 500, "Unable to save response.");
      return;
    }
    if (req.query.redirect) {
      res.redirect(`/call/${slug}`);
      return;
    }
    req.utils.success_res(res, "Session created", {
      id: slug,
      call_url: `${req.config.app.base_url}/call/${slug}`,
      ot_session_id: session.sessionId,
      ot_api_key: req.config.opentok.api_key
    });
  });
});


/**
 * Handler to fetch token for a call
 */
router.get("/:id/token", load_call, (req, res) => {
  let slug = req.query.slug || crypto.randomBytes(3).toString("hex");
  let token;

  try {
    token = req.OT.generateToken(req.call_data.ot_session_id, {
      role: "publisher",
      expireTime: Math.round((Date.now()/1000) + (60*60)) // 1 hour from now()
    });
  } catch (e) {
    console.log("Error", e);
    req.utils.error_res(res, 500, "Unable to fetch token from OpenTok. Check API keys.");
    return;
  }

  req.utils.success_res(res, "Token created", {
    ot_token: token,
    ot_session_id: req.call_data.ot_session_id,
    ot_api_key: req.config.opentok.api_key,
    call_id: req.call_data.id,
    call_url: `${req.config.app.base_url}/call/${req.call_data.id}`
  });
});

// Export the router
module.exports = router;
