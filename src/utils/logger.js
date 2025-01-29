// David's pino logger.

// npm install --save pino pino-pretty pino-http

// Use `info` as our standard log level if not specified
const options = { level: process.env.LOG_LEVEL || "debug" };

// If we're doing `debug` logging, make the logs easier to read
if (options.level === "debug") {
  // https://github.com/pinojs/pino-pretty
  options.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  };
}

// Create and export a Pino Logger instance:
// https://getpino.io/#/docs/api?id=logger
module.exports = require("pino")(options);
