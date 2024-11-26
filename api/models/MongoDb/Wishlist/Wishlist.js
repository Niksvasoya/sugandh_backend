let mongoose = require('mongoose')
let Schema = mongoose.Schema;

let WishlistSchema = new Schema({
    items: [{
        product_id: {
            // type: mongoose.Schema.Types.ObjectId,
            type: Number,
            // ref: "Product",
        },
        quantity: {
            type: Number,
            // default: 1,
        },
        product_variants_id: {
            type: Number,
            // default: 0,
        },
        amount: {
            type: String,
        },
        image: {
            type: String,
        },
        name: {
            type: String,
        },
        gst_value: {
            type: String,
        },
        hsn_code: {
            type: String,
        },
        product_name: {
            type: String,
        },
        tax_type_id: {
            type: String,
        },
        mrp: {
            type: String,
        },
        color: {
            type: String,
        },
        size: {
            type: String,
        }
    }],
    user_id: {
        type: Number,
        // ref: "User",
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

let Wishlist = mongoose.model("Wishlist", WishlistSchema)
module.exports = Wishlist