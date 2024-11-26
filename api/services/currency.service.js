const axios = require("axios");
const currencyConvert = async (symbol, quote_currency) => {
  let data;
  try {
    const options = {
      url: `https://nomics.com/data/currencies-ticker?filter=any&include-fiat=true&interval=1d&symbols=${symbol}&quote-currency=${quote_currency}`,
      method: "GET",
    };
    // console.log(options)
    data = await axios(options);
  } catch (error) {
    return (data = error.error);
  }
  return data;
};

module.exports = {
  currencyConvert,
};
