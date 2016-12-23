/**
 * Draw from `videoEl` to `canvasEl`
 *
 * Code adapted from: https://timtaubert.de/blog/2012/10/building-a-live-green-screen-with-getusermedia-and-mediastreams/
 */
var canvas_draw = function (videoElement, canvas) {
  "use strict";

  var tmpCanvas,
      tmpCtx,
      ctx,
      imgData;

  var replaceGreen = function (data) {
    var len = data.length;

    for (var i = 0, j = 0; j < len; i++, j += 4) {
      // Convert from RGB to HSL...
      var hsl = rgb2hsl(data[j], data[j + 1], data[j + 2]);
      var h = hsl[0], s = hsl[1], l = hsl[2];

      // ... and check if we have a somewhat green pixel.
      if (h >= 90 && h <= 160 && s >= 25 && s <= 90 && l >= 20 && l <= 75) {
        data[j + 3] = 0;
      }
    }
  };

  var replaceGray = function (data) {
    var len = data.length;

    for (var i = 0, j = 0; j < len; i++, j += 4) {
      // Convert from RGB to HSL...
      var l = rgb2hsl(data[j], data[j + 1], data[j + 2])[2];

      // ... and check if we have a somewhat gray pixel.
      if (l >0 && l <= 30) {
        data[j + 3] = 0;
      }
    }
  };

  var rgb2hsl = function (r, g, b) {
    r /= 255; g /= 255; b /= 255;

    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta = max - min;
    var h, s, l;

    if (max == min) {
      h = 0;
    } else if (r == max) {
      h = (g - b) / delta;
    } else if (g == max) {
      h = 2 + (b - r) / delta;
    } else if (b == max) {
      h = 4 + (r - g) / delta;
    }

    h = Math.min(h * 60, 360);

    if (h < 0) {
      h += 360;
    }

    l = (min + max) / 2;

    if (max == min) {
      s = 0;
    } else if (l <= 0.5) {
      s = delta / (max + min);
    } else {
      s = delta / (2 - max - min);
    }

    return [h, s * 100, l * 100];
  };

  // Draws a frame on the specified canvas after applying the filter
  // every requestAnimationFrame
  var drawFrame = function() {
    if (!ctx) {
      ctx = canvas.getContext('2d');
    }
    if (!tmpCanvas) {
      tmpCanvas = document.createElement('canvas');
      tmpCtx = tmpCanvas.getContext('2d');
      tmpCanvas.width = canvas.width;
      tmpCanvas.height = canvas.height;
    }
    tmpCtx.drawImage(videoElement, 0, 0, tmpCanvas.width, tmpCanvas.height);
    imgData = tmpCtx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height);

    // Do the replace
    // replaceGray(imgData.data);
    replaceGreen(imgData.data);

    ctx.putImageData(imgData, 0, 0);
    requestAnimationFrame(drawFrame);
  };

  // Drawing
  console.log("Drawing");
  requestAnimationFrame(drawFrame);

};
