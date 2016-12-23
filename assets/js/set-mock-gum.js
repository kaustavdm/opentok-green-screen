/* global mockGetUserMedia, canvas_draw */

var videoElement,
    canvas;

// Send mock user media by capturing manipulated stream from
// canvas
mockGetUserMedia(function (stream) {
  console.log("Got gUM stream", stream);
  var canvasStream;

  if (!canvas) {
    canvas = document.createElement("canvas");
  }

  // Set canvas attributes and get canvas context.
  canvas.getContext("2d");

  if (!videoElement) {
    videoElement = document.createElement('video');
  }

  videoElement.setAttribute("width", 320);
  videoElement.setAttribute("height", 240);
  videoElement.muted = 'true';
  videoElement.src = URL.createObjectURL(stream);

  videoElement.addEventListener('loadedmetadata', function () {
    videoElement.play();
    canvas.width = videoElement.width;
    canvas.height = videoElement.height;

    // Do the redrawing of canvas to apply green screen filter.
    canvas_draw(videoElement, canvas);
  });

  // Get the stream from the canvas.
  canvasStream = canvas.captureStream();

  console.log("[mockGetMserMedia] Video element", videoElement);
  console.log("[mockGetUserMedia] Canvas", canvas);

  if (stream.getAudioTracks().length) {
    // Add the audio track to the stream
    // This actually doesn't work in Firefox until version 49
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1271669
    canvasStream.addTrack(stream.getAudioTracks()[0]);
  }

  return canvasStream;
});
