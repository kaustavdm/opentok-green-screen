OpenTok Green Screen
==========================

A green-screen WebRTC demo based on OpenTok.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/kaustavdm/opentok-green-screen)

## Requirements

### Server-side

- NodeJS v6.9+
- TokBox Account (API Key and Secret)

### Browser

- Chrome 51+
- Firefox 49+

This demo uses the `captureStream` API and adds audio to stream, which only works in these browser versions and above.

## Install

- Copy `config.sample.js` to `config.js` and edit configuration. (See the next section for SSL requirements.)
- Install dependencies: `npm install`
- Start the application with: `npm start`

### SSL requirements

You will need SSL to use this demo on latest browsers. You can either set up a proxy through nginx or apache and run this application without SSL, or you can run have `node` serve it directly on SSL when you run `npm start`.

If you want `node` to serve this application using SSL, you will need to edit `config.js` and change `ssl.enabled` to `true`. Change the values in the `ssl` section to point to your key and certificate pair.

**Self-signed certificate**: If you have `openssl` installed and on `PATH`, you can run `npm run certs` to generate a self-signed certificate. This command will create `key.pem` and `cert.pem` in the project root, which are also the default value for the `ssl` configuration.

If you are deploying to Heroku, you do not need to worry about the SSL config.

## Project architecture

- `server.js` - This is the main server script that loads the APIs and starts the NodeJS server.
- `config.sample.js` - Contains the project configuration, which needs to be copied to `config.js` before running the server.
- `api/session.js` - Contains a simple JSON API for fetching OpenTok sessions and tokens. This API abstracts OpenTok sessions as rooms. Each rooms use an OpenTok session ID and creates a new token for each room join request.
- `assets/` - Client-side assets (styles, scripts, images) that are served as static files by the server.
- `views/` - Server-side views that are rendered.

## Credits

- Green Screen code: [Building a live green screen](https://timtaubert.de/blog/2012/10/building-a-live-green-screen-with-getusermedia-and-mediastreams/)
- Mock `getUserMedia` & `requestAnimationFrame` concept: [aullman/opentok-camera-filters](https://github.com/aullman/opentok-camera-filters)
- Icon source - [Communication Icons](https://www.iconfinder.com/icons/1518229/baloom_cellphone_communication_talk_text_texting_icon) by Thalita Torres.
