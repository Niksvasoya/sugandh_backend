const validationService = require("../../services/validation.service");
const { PaymentSchemas } = require("../../schemas/AccountingSchemas");
const { calculateLimitAndOffset, paginate } = require("paginate-info");
const stripe = require("stripe")(
  "sk_test_51LKGfvLgWmAteLkv82SFkOJ2fPMtxnJeV9TRjljxDUcTFnkUGApylIK9vk0sJygsEDvlLaP9OiIUNzppWSNFVJhq00xv0URct2"
);
const Razorpay = require("razorpay");
const crypto = require("crypto");
const RAZORPAY_APT_SECRET = "Sc6K0VLcc6QOqLW4sxICinLN";

const PaymentApi = () => {
  // For create and update Payment
  const save = async (req, res) => {
    // console.log("final", req.body)
    await validationService.convertIntObj(req.body);

    validationService
      .validate(req.body, PaymentSchemas)
      .then(async (reqData) => {
        try {
          // console.log("check")
          // for already existing user payment
          if (reqData.is_customer) {
            const data = stripe.charges
              .create({
                amount: parseInt(reqData.amount) * 100,
                description: "This is test transaction",
                currency: "USD",
                customer: reqData.customer_id,
              })
              .then((charge) => {
                //console.log(customer.id, "hiral");
                return res.status(200).json({
                  code: 2000,
                  success: true,
                  message: `Payment successfull`,
                  data: charge,
                });
              })
              .catch((err) => {
                console.log(err);
                return res.status(200).json({
                  code: 2000,
                  success: false,
                  message: `Payment failed`,
                  err: err,
                });
              });
          }
          // for new user or not added wallet amount
          else {
            const customer = stripe.customers
              .create({
                email: reqData.email,
                source: reqData.token.id,
                name: reqData.name,
                address: reqData.address,
              })
              .then((customer) => {
                return stripe.charges.create({
                  amount: parseInt(reqData.amount) * 100,
                  description: "This is test transaction",
                  currency: "USD",
                  customer: customer.id,
                });
              })
              .then((charge) => {
                return res.status(200).json({
                  code: 2000,
                  success: true,
                  message: `Payment successfull`,
                  data: charge,
                });
              })
              .catch((err) => {
                return res.status(200).json({
                  code: 2000,
                  success: false,
                  message: `Payment failed`,
                  err: err,
                });
              });
          }
        } catch (error) {
          console.log(error);
          return res.status(error.status).json(error);
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          code: 500,
          success: false,
          message: "Internal Server Error",
          error: err,
        });
      });
  };

  const refundAmount = async (req, res) => {
    try {
      const refund = await stripe.refunds
        .create({
          charge: req.body.charge_id,
        })
        .then((refund) => {
          console.log(refund);
          return res.status(200).json({
            code: 2000,
            success: true,
            message: `Refund successfully`,
            data: refund,
          });
        })
        .catch((err) => {
          return res.status(200).json({
            code: 2000,
            success: false,
            message: `Refund failed`,
            err: err,
          });
        });
      console.log(refund, "refu");
    } catch (error) {
      return res.status(error.status).json(error.error);
    }
  };

  const paymentRazorPay = async (req, res) => {
    try {
      const instance = new Razorpay({
        key_id: "rzp_test_oR6zG7nLyjGUkn",
        key_secret: "Sc6K0VLcc6QOqLW4sxICinLN",
      });
      const options = {
        amount: Number(req.body.amount) * 100,
        currency: req.body.currency,
      };
      const order = await instance.orders.create(options);
      return res.status(200).json({
        code: 200,
        success: true,
        message: `successfully`,
        data: order || {},
      });
    } catch (error) {
      console.error(error);
      return res.status(error.status).json(error);
    }
  };

  const refundRazorPay = async (req, res) => {
    try {
      const instance = new Razorpay({
        key_id: "rzp_test_oR6zG7nLyjGUkn",
        key_secret: "Sc6K0VLcc6QOqLW4sxICinLN",
      });
      const refund = await instance.payments.refund(
        req.body.payment_id,
        req.body.data
      );
      return res.status(200).json({
        code: 200,
        success: true,
        message: `Refund successfully`,
        data: refund || {},
      });
    } catch (error) {
      console.error(error);
      return res.status(200).json({
        code: 200,
        success: true,
        message: `Refund failed`,
        error: error || {},
      });
    }
  };

  const paymentVerification = async (req, res) => {
    try {
      console.log(req.body);
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

      const body = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac("sha256", RAZORPAY_APT_SECRET)
        .update(body.toString())
        .digest("hex");

      const isAuthentic = expectedSignature === razorpay_signature;

      if (isAuthentic) {
        return res.redirect(`https://sugandh.co/paymentsuccess`);
      } else {
        return res.redirect(`https://sugandh.co/paymentfailed`);
      }
    } catch (error) {
      console.error(error);
      return res.status(error).json(error);
    }
  };

  const getOrderByIdRazorPay = async (req, res) => {
    try {
      const instance = new Razorpay({
        key_id: "rzp_test_oR6zG7nLyjGUkn",
        key_secret: "Sc6K0VLcc6QOqLW4sxICinLN",
      });
      // const options = {
      //     amount: Number(req.body.amount) * 100,
      //     currency: req.body.currency,
      // };
      const order = await instance.orders.fetch(req.query.order_id);
      return res.status(200).json({
        code: 200,
        success: true,
        message: `successfully`,
        data: order || {},
      });
    } catch (error) {
      console.error(error);
      return res.status(error.status).json(error);
    }
  };
  const getPaymentByOrderIdRazorPay = async (req, res) => {
    try {
      const instance = new Razorpay({
        key_id: "rzp_test_oR6zG7nLyjGUkn",
        key_secret: "Sc6K0VLcc6QOqLW4sxICinLN",
      });
      // const options = {
      //     amount: Number(req.body.amount) * 100,
      //     currency: req.body.currency,
      // };
      console.log(req.query.order_id);
      const payment = await instance.orders.fetchPayments(req.query.order_id);
      return res.status(200).json({
        code: 200,
        success: true,
        message: `successfully`,
        data: payment || {},
      });
    } catch (error) {
      console.error(error);
      return res.status(error.status).json(error);
    }
  };

  const getPaymentByPaymentIdRazorPay = async (req, res) => {
    try {
      const instance = new Razorpay({
        key_id: "rzp_test_oR6zG7nLyjGUkn",
        key_secret: "Sc6K0VLcc6QOqLW4sxICinLN",
      });
      // const options = {
      //     amount: Number(req.body.amount) * 100,
      //     currency: req.body.currency,
      // };
      console.log(req.query.payment_id);
      const payment = await instance.payments.fetch(req.query.payment_id);
      return res.status(200).json({
        code: 200,
        success: true,
        message: `successfully`,
        data: payment || {},
      });
    } catch (error) {
      console.error(error);
      return res.status(error.status).json(error);
    }
  };

  return {
    save,
    refundAmount,
    paymentRazorPay,
    paymentVerification,
    refundRazorPay,
    getOrderByIdRazorPay,
    getPaymentByOrderIdRazorPay,
    getPaymentByPaymentIdRazorPay,
  };
};
module.exports = PaymentApi;
