const mongoose = require("mongoose");

const connectDb = () => {
  try {
    if (!process.env.DB_URL) throw new Error();
    mongoose.connect(process.env.DB_URL, {
      dbName: process.env.DB_NAME,
      user: process.env.DB_USER,
      pass: process.env.DB_PASS,
    });
    const db = mongoose.connection;
    db.on(
      "error",
      console.error.bind(console, "error occurred in connection db")
    );
    db.once("open", function cb() {
      console.log("connection made successfully");
    });
  } catch (error) {
    console.log("path undefined error", error);
  }
};

module.exports = {
  connectDb,
};
