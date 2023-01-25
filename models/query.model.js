const mongoose = require("mongoose");

const Query = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactNo: { type: String, required: true },
    message: { type: String, required: true }
  },
  { collection: "queries" }
);

const model = mongoose.model("QueryData", Query);

module.exports = model;
