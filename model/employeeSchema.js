const { model, Schema, Types } = require("mongoose");
const moment = require("moment");

// let Schema = mongoose.Schema;

let employeeSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },

    phoneNo: {
      type: Number,
    },
    designation: {
      type: String,
    },
    department: {
      type: String,
    },
    token: {
      type: String,
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

let employeeModel = model("Iamops_employee", employeeSchema);

// Exporting both models
module.exports = employeeModel;
