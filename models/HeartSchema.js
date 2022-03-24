const mongoose = require("mongoose");
var validateStatus = function (status) {
  var re = /(unresolved|helpfound|resolved)/;
  return re.test(status);
};

const dataSchema = new mongoose.Schema({
  deviceId: String,
  BPM: Number,
  helpStatus: {
    type: String,
    default: "unresolved",
    validate: [
      validateStatus,
      "Status must be unresolved, helpfound or resolved",
    ],
    match: /(unresolved|helpfound|resolved)/,
  }, // unresolved, helpfound, resolved
  isAnomal: Boolean,
  location: {
    type: { type: String, default: "Point" },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
  },
  date: { type: Date, default: Date.now },
});

module.exports = dataSchema;
