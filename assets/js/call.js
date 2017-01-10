/* global xhr, OT, canvas, canvas_draw */

window.addEventListener('load', function () {

  // Fetch token and if things work, carry on
  xhr("GET", "/api/session/" + call_id + "/token", function xhr_cb(err, data) {
    if (err !== null) {
      console.log(err);
      alert("Error fetching token. Check console.");
      return;
    }

    // Initialize OpenTok
    // Simple Hello World App
    var session = OT.initSession(data.payload.ot_api_key, data.payload.ot_session_id);
    session.on('streamCreated', function (event) {
      session.subscribe(event.stream, "ot-subscribers", {
        insertMode: "append",
        width: 320,
        height: 240
      }, function (err) {
        if (err) alert(err.message);
      });
    });

    // Connect to OT session
    session.connect(data.payload.ot_token, function (err) {
      if (err) alert(err.message);

      // Create a publisher. This is where the magic happened.
      var publisher = session.publish("ot-publisher", {

        // We send out a low enough resolution to avoid exploding your computer, for now.
        resolution: "320x240",

        width: 320,
        height: 240,
        mirror: false
      }, function (err) {
        if (err) {
          alert("Error in publishing");
          console.log("Error in publishing", err);
          return;
        }
      });

      // Poll till the `canvas` is ready
      var interval = setInterval(function () {
        if (canvas) {
          document.getElementById(publisher.id).appendChild(canvas);
          clearInterval(interval);
        }
      }, 1000);
    });
  });
});
