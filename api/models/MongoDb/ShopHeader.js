let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let ShopHeaderSchema = new Schema({
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
let ShopHeader = mongoose.model("ShopHeader", ShopHeaderSchema);
module.exports = ShopHeader;
