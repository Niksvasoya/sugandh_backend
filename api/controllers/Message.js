const MessageApi = () => {
  // Create Customer
  //  This function is used create customer in stripe.
  const sendMessage = async (req, res) => {
    try {
      console.log(req.body, ">>>>>>");
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

  return {
    sendMessage,
  };
};
module.exports = MessageApi;
