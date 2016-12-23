/**
 * Takes a mockOnStreamAvailable function which when given a
 * webrtcstream returns a new stream to replace it with.
 *
 * @source https://github.com/aullman/opentok-camera-filters/blob/master/src/mock-get-user-media.js
 */
function mockGetUserMedia(mockOnStreamAvailable) {
  var oldGetUserMedia;
  if (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
    oldGetUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;
    navigator.webkitGetUserMedia = navigator.getUserMedia = navigator.mozGetUserMedia =
      function getUserMedia(constraints, onStreamAvailable, onStreamAvailableError,
                            onAccessDialogOpened, onAccessDialogClosed, onAccessDenied) {
        console.log("Used old gUM");
        return oldGetUserMedia.call(navigator, constraints, function (stream) {
          console.log("Returning mock stream", stream);
          onStreamAvailable(mockOnStreamAvailable(stream));
        }, onStreamAvailableError,
        onAccessDialogOpened, onAccessDialogClosed, onAccessDenied);
      };
  } else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    oldGetUserMedia = navigator.mediaDevices.getUserMedia;
    navigator.mediaDevices.getUserMedia = function getUserMedia (constraints) {
      console.log("Used new gUM (navigator.mediaDevices.getUserMedia)");
      return new Promise(function (resolve, reject) {
        oldGetUserMedia.call(navigator.mediaDevices, constraints).then(function (stream) {
          console.log("Returning mock stream", stream);
          resolve(mockOnStreamAvailable(stream));
        }, function (reason) {
          console.log("Rejected mock stream", reason);
          reject(reason);
        }).catch(function(err) {
          console.log("Error getting mock stream", err);
        });
      });
    };
  } else {
    console.log('Could not find getUserMedia function to mock out');
  }
};
