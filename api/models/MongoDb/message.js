let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let MessageSchema = new Schema({
  timestamp: {
    required: true,
    type: Schema.Types.Date,
    default: Date.now(),
  },
  message: {
    required: false,
    type: Schema.Types.String,
  },
  subject: {
    required: false,
    type: Schema.Types.String,
  },
  email: {
    required: false,
    type: Schema.Types.String,
  },
  name: {
    required: false,
    type: Schema.Types.String,
  },
});
let Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
