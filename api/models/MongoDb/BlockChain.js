let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let BlockChainSchema = new Schema({
  index: {
    required: true,
    type: Schema.Types.Number,
  },
  timestamp: {
    required: true,
    type: Schema.Types.Date,
    default: Date.now(),
  },
  prevHash: {
    required: false,
    type: Schema.Types.String,
  },
  hash: {
    required: true,
    type: Schema.Types.String,
  },
  data: {
    required: false,
    type: Schema.Types.Array,
  },
});
let BlockChain = mongoose.model("BlockChain", BlockChainSchema);
module.exports = BlockChain;
