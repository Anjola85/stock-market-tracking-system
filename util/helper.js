const Stocks = require("stocks.js");

const ApiResponse = (meta, data = null) => {
  let response = {};
  response._meta = meta;
  if (data) {
    response.data = data;
  }
  return response;
};

const successResponse = () => ({
  status: true,
  statusCode: 200,
  message: "Operation was successfull",
});
const errorResponse = (
  statusCode,
  message = "There is an error in your input"
) => ({ status: false, statusCode, message });

const stockRetrieval = (symbol, interval, amount) => {
  return {
    symbol,
    interval,
    amount,
  };
};

module.exports = {
  ApiResponse,
  stockRetrieval,
  successResponse,
  errorResponse,
};
