const { model, Schema, Types } = require("mongoose");
const moment = require("moment");

// let Schema = mongoose.Schema;

let adminSchema = new Schema(
  {
    email: {
      type: String,
    },
    password: {
      type: String,

      // required: true,
    },
    confirmPassword: {
      type: String,

      // required: true,
    },
    token: {
      type: String,

      // required: true,
    },
  
  },
  {
    timestamps: {
      currentTime: () =>
        moment(new Date()).utcOffset("+05:30").format("YYYY-MM-DD[T]HH:mm:ss"),
    },
    versionKey: false,
  }
);

// Creation Of User & Admin Model

let adminModel = model("Iamops_admin", adminSchema);

// Exporting both models
module.exports = adminModel;
