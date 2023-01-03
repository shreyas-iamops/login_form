const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { connectDb } = require("./dbConnection");
const { appRouter } = require("./routes/routes");
const path = require("path")
const bodyParser = require("body-parser")
const cors = require('cors')
const ejs = require('ejs')
const cookieParser = require('cookie-parser')



dotenv.config();
// db connection

connectDb();

// routes

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(cookieParser())

app.use("/", appRouter);
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname + "/public")));

//setup ejs
app.set('view engine', 'ejs')




app.listen(process.env.port, () => {
  console.log("server is running on ,", process.env.port);
});