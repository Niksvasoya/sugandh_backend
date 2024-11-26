let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let CollectioHeaderSchema = new Schema({
  timestamp: {
    required: true,
    type: Schema.Types.Date,
    default: Date.now(),
  },
  image: {
    required: false,
    type: Schema.Types.String,
  },
});
let CollectioHeader = mongoose.model("CollectioHeader", CollectioHeaderSchema);
module.exports = CollectioHeader;
