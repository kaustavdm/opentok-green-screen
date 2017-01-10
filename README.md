OpenTok Green Screen
==========================

A [green-screen](https://en.wikipedia.org/wiki/Chroma_key) WebRTC demo based on OpenTok.

[![Deploy to Heroku](https://img.shields.io/badge/Deploy-Heroku-blue.svg)](https://heroku.com/deploy?template=https://github.com/kaustavdm/opentok-green-screen) [![Demo mirror #1](https://img.shields.io/badge/Demo-mirror_1-green.svg)](https://opentok-green-screen.kaustavdm.in/) [![Demo mirror #2](https://img.shields.io/badge/Demo-mirror_2-green.svg)](https://opentok-green-screen.herokuapp.com/)

## Table of Contents

- [Requirements](#requirements)
- [Architecture](#architecture)
  - [How it works](#how-it-works)
  - [Project layout](#project-layout)
- [Install and deploy](#install)
- [Credits](#credits)

---

## Requirements

### Server-side

- NodeJS v6.9+
- TokBox Account (API Key and Secret)

### Client-side

- Browsers: Chrome 51+, Firefox 49+.
- A webcam
- A green screen behind you

This demo uses the `captureStream` API and adds audio to stream, which only works in these browser versions and above.

**Note:** This demo uses significant CPU due to the amount of image manipulations required. You may hear your computer groaning. Don't worry.

## Architecture

### How it works

This demo has three main components: A `<video>` element, an intermediate canvas (c1) and a final canvas (c2). The stages in which it works are:

1. User's media is captured from camera (webcam) and played in the `<video>` element.
2. On each animation frame of the `<video>` element, its contents are put the intermediate `<canvas>` element, c1.
3. Each frame of c1 is taken and a modified image data is produced per frame by making all matching green pixels transparent.
4. For each frame of c1, c2 is painted with a pre-defined background image and then overlayed with the modified image data from c1.
5. `getUserMedia` is hijacked to return captured stream from c2 by calling `captureStream()` on c2, which is then piped in to OpenTok's stream.

This process ensures that the stream sent out by an OpenTok publisher already has the replacement done. While this puts more load on the publisher, there are no further manipulations required on the subscribers' side.

### Project layout

- `server.js` - This is the main server script that loads the APIs and starts the NodeJS server.
- `config.sample.js` - Contains the project configuration, which needs to be copied to `config.js` before running the server. (See [Install](#install) instructions).
- `api/session.js` - Contains a simple JSON API for fetching OpenTok sessions and tokens. This API abstracts OpenTok sessions as rooms. Each room maps to an OpenTok session ID. The API creates a new OpenTok session ID when creating a room and creates a new token for each room join request.
- `assets/` - Client-side assets (styles, scripts, images) that are served as static files by the server.
  - `assets/js/xhr.js` - A simple XHR wrapper.
  - **`assets/js/canvas-draw.js`** - This script provides a function for doing the actual green-screen replace using a HTML `canvas`.
  - **`assets/js/mock-get-user-media.js`** - Creates a function to override `getUserMedia`. We need it to be able to hijack `getUserMedia` return a stream that we want.
  - **`assets/js/set-mock-gum.js`** - This calls the override created by `mock-get-user-media.js` and sends the captured `canvas` stream.
  - **`assets/js/call.js`** - This fetches OpenTok credentials from the JSON API using XHR and sets up a simple multi-party call using OpenTok's JS SDK.
- `libs/` - Reusable utilities and libraries used by the application.
- `views/` - Server-side views that are rendered on requests.
  - `views/call.ejs` - This view is rendered during a call. See this to get an idea of how the scripts are loaded for the call.

## Install

### Deploy manually

- Clone/[Download](https://github.com/kaustavdm/opentok-green-screen/archive/master.zip) this repository.
- Copy `config.sample.js` to `config.js` and edit configuration. (See the next section for SSL requirements.)
- Install dependencies: `npm install`
- Start the application with: `npm start`

### Deploy to Heroku

Alternatively, you can quickly deploy this project to Heroku by clicking the button below. You will need OpenTok API key and secret and Heroku will manage the rest.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/kaustavdm/opentok-green-screen)

### SSL requirements

You will need SSL to use this demo on latest browsers. You can either set up a proxy through nginx or apache and run this application without SSL, or you can run have `node` serve it directly on SSL when you run `npm start`.

If you want `node` to serve this application using SSL, you will need to edit `config.js` and change `ssl.enabled` to `true`. Change the values in the `ssl` section to point to your key and certificate pair.

**Self-signed certificate**: If you have `openssl` installed and on `PATH`, you can run `npm run certs` to generate a self-signed certificate. This command will create `key.pem` and `cert.pem` in the project root, which are also the default value for the `ssl` configuration.

If you are deploying to Heroku, you do not need to worry about the SSL config.

## Credits

- Green Screen code: [Building a live green screen](https://timtaubert.de/blog/2012/10/building-a-live-green-screen-with-getusermedia-and-mediastreams/)
- Mock `getUserMedia` & `requestAnimationFrame` concept: [aullman/opentok-camera-filters](https://github.com/aullman/opentok-camera-filters)
- Icon source - [Communication Icons](https://www.iconfinder.com/icons/1518229/baloom_cellphone_communication_talk_text_texting_icon) by Thalita Torres.
