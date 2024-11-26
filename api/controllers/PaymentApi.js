const Stripe = require("stripe");
const stripe = Stripe(
  "sk_test_51I9RIPFGlCQ4kK1CMiWgaLDoj6uO93StJQnYBI4ufoT3nI8qNGO8zksD4zcLV3Prbql3ObtwZEoxCzd4GO4c0xcG00glrwRwL4"
);
const Razorpay = require("razorpay");
const crypto = require("crypto");

const PaymentApi = () => {
  // Create Customer
  //  This function is used create customer in stripe.
  const createCustomer = async (req, res) => {
    try {
      const stripe_customer = await stripe.customers.create({
        email: req.body.email,
      });
      return res.status(200).json({
        code: 200,
        success: true,
        message: `successfully`,
        // data: response || {}
      });
    } catch (error) {
      return res.status(error.status).json(error);
    }
  };
  // Create Connected Account
  // This function is used create account in stripe.
  const createAccount = async (req, res) => {
    try {
      // const [year, month, _date] = req.body.dob.split("-");
      // const date = _date.split("T").shift();

      // console.log({ date, month, year });
      // const payload = {
      //     type: 'custom',
      //     country: 'US',
      //     email: req.body.email,
      //     business_type: "individual",
      //     capabilities: {
      //         card_payments: { requested: true },
      //         transfers: { requested: true },
      //     },
      //     individual: {
      //         dob: {
      //             day: date,
      //             month: month,
      //             year: year
      //         },
      //         email: req.body.email,
      //         first_name: req.body.first_name,
      //         last_name: req.body.last_name,
      //         phone: req.body.phone,
      //     },
      //     settings: {
      //         "payouts": {
      //             "schedule": {
      //                 "interval": "daily"
      //             }
      //         }
      //     },
      //     business_profile: {
      //         mcc: "5812",
      //         product_description: "Nft payment",
      //     },
      //     tos_acceptance: {
      //         date: Math.floor(Date.now() / 1000),
      //         ip: "202.131.117.90" // Assumes you're not using a proxy
      //     }
      // }
      // console.log(payload,"payload")
      // const stripe_account = await stripe.accounts.create(payload);
      // console.log(stripe_account)

      // const payout = await stripe.payouts.create({
      //     amount: 1000,
      //     currency: 'inr',
      //     method: 'instant',
      //   }, {
      //     stripeAccount: 'acct_1L3L89SGijYRloWN',
      //   });
      const transfer = await stripe.transfers.create({
        amount: 400,
        currency: "usd",
        destination: "acct_1L3LD4EWqN3M0e41",
        transfer_group: "ORDER_95",
      });
      return res.status(200).json({
        code: 200,
        success: true,
        message: `successfully`,
        // data: response || {}
      });
    } catch (error) {
      console.error(error);
      return res.status(error.status).json(error);
    }
  };
  // const paymentRazorPay = async (req, res) => {

  //     try {
  //         const instance = new Razorpay({
  //             key_id: "rzp_test_oR6zG7nLyjGUkn",
  //             key_secret: "Sc6K0VLcc6QOqLW4sxICinLN",
  //         });
  //         const options = {
  //             amount: Number(50000),
  //             currency: "INR",
  //         };
  //         // console.log(instance)
  //         const order = await instance.orders.create(options);
  //         return res.status(200).json({
  //             code: 200,
  //             success: true,
  //             message: `successfully`,
  //             data: order || {}
  //         });

  //     } catch (error) {
  //         console.error(error);
  //         return res.status(error.status).json(error);
  //     }

  // };
  // const paymentVerification = async (req, res) => {

  //     try {
  //         console.log(req.body)
  //         const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
  //             req.body;

  //         const body = razorpay_order_id + "|" + razorpay_payment_id;

  //         const expectedSignature = crypto
  //             .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
  //             .update(body.toString())
  //             .digest("hex");

  //         const isAuthentic = expectedSignature === razorpay_signature;

  //         if (isAuthentic) {
  //             // Database comes here

  //             // await Payment.create({
  //             //     razorpay_order_id,
  //             //     razorpay_payment_id,
  //             //     razorpay_signature,
  //             // });
  //             return res.redirect(
  //                 `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
  //             );

  //             // return res.status(200).json({
  //             //     code: 200,
  //             //     success: true,
  //             //     message: `successfully`,
  //             //     // data: order || {}
  //             //     // data: razorpay_order_id || {}
  //             // });
  //         } else {
  //             res.status(400).json({
  //                 success: false,
  //             });
  //         }
  //         // return res.status(200).json({
  //         //     code: 200,
  //         //     success: true,
  //         //     message: `successfully`,
  //         //     // data: order || {}
  //         //     // data: razorpay_order_id || {}
  //         // });

  //     } catch (error) {
  //         console.error(error);
  //         return res.status(error.status).json(error);
  //     }

  // };

  return {
    createCustomer,
    createAccount,
    // paymentRazorPay,
    // paymentVerification
  };
};
module.exports = PaymentApi;
