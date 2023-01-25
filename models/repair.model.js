const mongoose = require("mongoose");

const Repair = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    imei : {type: String, required: true},
    status: {type: String, required: true},
    description: { type: String, required: true },
    type: { type: String, required: true },
    email: { type: String, required: true, unique: false},
  },
  { collection: "repair-requests" }
);

const model = mongoose.model("RepairData", Repair);

module.exports = model;
