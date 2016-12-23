/**
 * Simple XHR handling with JSON response
 */
var xhr = function(method, url, callback) {
  var req = new XMLHttpRequest();
  req.addEventListener("load", function () {
    if (this.status !== 200) {
      callback(this.status);
      return;
    }
    callback(null, this.responseType === "json" ? this.response : this.responseText);
  });
  req.responseType = "json";
  req.addEventListener("error", function (e) {
    callback(e);
  });
  req.open(method, url);
  req.send();
};
