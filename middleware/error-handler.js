const mongoose = require("mongoose");
const { errorResponse, ApiResponse } = require("../util/helper");
const { CONFLICT, INTERNAL_SERVER_ERROR } = require("../util/status-codes");

const errorHandler = (error, req, res, next) => {
  console.log("err-here:", error);
  let meta = errorResponse();
  if (error instanceof mongoose.Error) {
    meta = errorResponse(503, "Some setup error in our data store");
    meta.developerMessage = mongoose.error;
  } else if (error.name === "MongoError") {
    meta.statusCode = CONFLICT;
    meta.developerMessage = error;
  } else if (error instanceof Error) {
    meta.statusCode = INTERNAL_SERVER_ERROR;
    meta.message = error.message;
    meta.developerMessage = error;
  } else if (error instanceof TypeError) {
    meta.statusCode = INTERNAL_SERVER_ERROR;
    meta.message = error.message;
    meta.developerMessage = error;
  } else {
    meta.statusCode = INTERNAL_SERVER_ERROR;
    meta.message =
      "Apologies please we currently have a downtime now, please try again later";
    meta.developerMessage = error;
  }
  return res.status(meta.statusCode).json(ApiResponse(meta));
};

module.exports = errorHandler;
