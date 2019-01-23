
// Select the codec used for functionality which requires
// encoding/decoding data before being sent to elasticsearch.

// JSON codec
const json = {
  encode: (value) => JSON.stringify(value),
  decode: (text)  => JSON.parse(text)
};

// msgpack codec
// const msgpack = require("msgpack-lite");

module.exports = json;