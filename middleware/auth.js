const Joi = require("joi");
const ejs = require("ejs");
const jwt = require("jsonwebtoken");

//middleware
const auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    console.log(token);
    const authToken = token && token.split(" ")[1];
    console.log(authToken);
    // console.log(req.headers)
    if (authToken == undefined) {
      console.log("unauthorized request");
      return res.status(404).json({ message: "unauthorized request" });
    }
    if (authToken) {
      const verifyAdmin = jwt.verify(authToken, process.env.SECRET_KEY);
      console.log(jwt.verify(authToken, process.env.SECRET_KEY));

      next();
    }
  } catch (error) {
    res.status(400).json("something went wrong while adding the app");
  }
};

module.exports = {
  auth,
};
