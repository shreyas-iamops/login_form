const { model, Schema, Types } = require("mongoose");
const moment = require("moment");

// let Schema = mongoose.Schema;

let managerSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,

      required: true,
    },
    password: {
      type: String,

      required: true,
    },
    contactNo: {
      type: Number,
    },
    dept: {
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

let managerModel = model("Iamops_manager", managerSchema);

// Exporting both models
module.exports = managerModel;
