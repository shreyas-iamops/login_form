const dotenv = require("dotenv");
dotenv.config();
const Joi = require("joi");
const CryptoJS = require("crypto-js");
// const jwt = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const adminModel = require("../model/adminSchema");
const managerModel = require("../model/managerSchema");
const employeeModel = require("../model/employeeSchema");

//##### JOI validation for admin  #####

// const Schema = Joi.object().keys({
//   name: Joi.string().min(3).required(),

//   email: Joi.string().email().required(),
//   password: Joi.string().min(8).required(),
//   contactNo: Joi.number().min(10).required(),
//   dept: Joi.string().min(3).required(),
// });

//##############  EMPLOYEE  ###################

const page = async (req, res) => {
  try {
    res.status(200).json({ message: "Welcome to IAMOPS" });
  } catch (error) {
    res.status(200).json({ message: "Something went wrong" });
  }
};

//joi validation for employee registration
const SchemaEmployee = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),

  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  phoneNo: Joi.number().min(10).required(),
  designation: Joi.string().min(3).required(),
  // department: Joi.string().min(3).required(),
  token: Joi.string().optional(),
});

//employee registration
const employeeRegistration = async (req, res) => {
  try {
    const payload = req.body;
    if (SchemaEmployee.validate(payload).error) {
      res.status(422).json({
        message: "Employee not added.Please check all field are correct",
      });
      return;
    }
    // if (!payload) {
    //   res.status(404).json({ message: "Please enter all fields" });
    // }
    const payLoadValue = Schema.validate(payload).value;
    const employeeExist = await employeeModel.findOne({
      email: payLoadValue.email,
    });
    console.log(employeeExist, "*****************************");
    if (!employeeExist) {
      const passwordToken =jwt.sign(
        payLoadValue.password,
        process.env.SECRET_KEY
      ).toString();;
      const savedUser = await new employeeModel(payLoadValue).save();
      const generatetoken = jwt.sign(savedUser.id, process.env.SECRET_KEY);
      console.log(generatetoken);
      const update = await employeeModel.findByIdAndUpdate(savedUser.id, {
        token: generatetoken,
        password:passwordToken,
        new: true,
      });
      console.log(update);
      console.log(savedUser, "Employee Register successfully");
      res.status(200).json({
       
        firstName: update.firstName,
        lastName: update.lastName,
        email: update.email,
        designation: update.designation,
        department: update.department,
        token: update.token,
        message: "Employee Registered successfully",
      });
      // res.json({email:user.email,id:user.id,token:user.token})
      // document. location. reload()
      return;
    }
    res.status(400).json({ message: "Employee already exist" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Something went wrong while Employee registration" });
  }
};

//get all employee
const getAllEmployee = async (req, res) => {
  try {
    const data = await employeeModel.find({});
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong while fetching list of all admin",
    });
  }
};

//get single employee
const singleEmployee = async (req, res) => {
  try {
    console.log("In get single user");
    payload = req.params.id;
    console.log(payload);
    if (payload === undefined || !payload) {
      console.log("no id present in params");
      return;
    }
    const user = await employeeModel.findById({ _id: payload });
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    res
      .status(400)
      .json({ message: "something went wrong while getting the single user" });
    console.log("something went wrong while getting the single user");
  }
};

//##### JOI validation for admin  #####

const Schema = Joi.object().keys({
  email: Joi.string().min(3).required().email().optional(),

  password: Joi.string().min(8).optional(),
  confirmPassword: Joi.string().min(8).optional(),
  token: Joi.string().optional(),

  //  repeat_password: Joi.ref('password'),

  // phone: Joi.string().length(10)
});

//######## ADMIN REGISTRATION  ######
const adminRegistration = async (req, res) => {
  try {
    const payload = req.body;
    if (Schema.validate(payload).error) {
      res
        .status(422)
        .json({ message: "Admin not added.Please check email and password" });
      return;
    }
    const payLoadValue = Schema.validate(payload).value;
    console.log(payLoadValue);
    if (payLoadValue.password != payLoadValue.confirmPassword) {
      console.log("password and confirm password is not same");
      res
        .status(400)
        .json({ message: "password and confirm password is not same" });
      return;
    }

    const adminExist = await adminModel.findOne({
      email: payLoadValue.email,
    });
    if (!adminExist) {
      const encryptedPassword = CryptoJS.AES.encrypt(
        payLoadValue.password,
        process.env.SECRET_KEY
      ).toString();
      const saveAdmin = {
        email: payLoadValue.email,
        password: encryptedPassword,
      };
      const save = await new adminModel(saveAdmin).save();
      console.log("admin registered successfully");
      res.status(200).json(save);
      return;
    } else {
      res.status(400).json({ message: "admin already exist" });
    }
  } catch (error) {
    res.status(400).json("something went wrong while admin registration");
  }
};

//get All admins
const getAllAdmin = async (req, res) => {
  try {
    const data = await adminModel.find({});
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong while fetching list of all admin",
    });
  }
};

//admin login
const adminLogin = async (req, res) => {
  console.log("In adminLogin");
  try {
    const payload = req.body;
    console.log(payload);
    if (Schema.validate(payload).error) {
      res.status(422).json({
        message: "Admin not Logged in.Please check email and password",
      });
      return;
    }
    const payLoadValue = Schema.validate(payload).value;
    console.log(payLoadValue.email);
    const user = await adminModel.findOne({
      email: payLoadValue.email,
    });
    console.log(user);

    if (!user) {
      return res.status(403).json({ message: "User Name Not Found " });
    }
    const data = user.password;
    console.log(data, "Above decrypt block");
    const decrypted = CryptoJS.AES.decrypt(
      data,
      process.env.secret_key
    ).toString(CryptoJS.enc.Utf8);
    console.log(decrypted, "decrypted password");
    console.log(payLoadValue.password, "password in the body");
    if (payLoadValue.password !== decrypted) {
      res.status(401).json({ message: "password incorrect" });
      return;
    }
    console.log(
      "decrypted password matched with user credentials successfully"
    );
    // res.status(200).json({ message: "Logged in successfully" });
    //generation of login token
    token = jwt.sign(payLoadValue, process.env.SECRET_KEY); //generate login token
    console.log(token);

    res.status(200).setHeader("x-auth-token", token).json({ user, token });

    console.log("LOGIN TOKEN GENERATED SUCCESSFULLY");
  } catch (error) {
    res.status(400).json("something went wrong while login");
  }
};

//employee login

const login = async (req, res) => {
  console.log("in login api");
  try {
    const payload = req.body;
    const user = await employeeModel.findOne({ email: payload.email });
    console.log(user);
    // console.log(decryptPassword, payload.password,"#####password#######")
    
    if (!user) {
      console.log("user does not exists");
      res.status(404).json({ message: "User does not exist" });
      return;
    } else {
      // console.log(user.password,"jai hind")
   
      // console.log(decrypt, payload.password, "check password ")
      // const decryptPassword = jwt.verify(user.password, process.env.AES_KEY);
      // console.log(decryptPassword,"@#$@$@#$%$#%#$%#@#$@#$@#$@#")
      const decryptedPassword = jwt.verify(
        user.password,
        process.env.SECRET_KEY
      ).toString();
      console.log(decryptedPassword, payload.password)
     
      if (decryptedPassword !== payload.password) {
        console.log("password is incorrect");
        res.status(400).json({ message: "Incorrect password" });
        return;
      }

      if (user.designation === "Manager") {
        console.log("i am manager");
        const managerTeam = await employeeModel.find({ dept: user.dept });
        // console.log(managerTeam);
        res
          .status(200)
          .json({ id: user.id, email: user.email, token: user.token });
        // res.status(200).json({firstName:update.firstName, lastName:update.lastName, email:update.email, designation:update.designation, department:update.department, token:update.token});

        //     // .status(200)
        // .setHeader("x-auth-token", token)
        // .render("loginManager", { records: managerTeam, hello: "hello" });
        // res.status(200).json({managerTeam,message:"Render data of user under the manager"})
        // console.log("render admin panel of manager");
      } else {
        // console.log("search employee form the employee model and get their respective data")
        // console.log("this is the data of interns")

        const profile = await employeeModel.find({ email: payload.email });

        // res.status(200).json(user)
        res.json({ email: user.email, id: user.id, token: user.token });

        //     // .status(200)
        //     // .setHeader("x-auth-token", token)
        // .render("userProfile", { records: profile, hello: "hello" });
        console.log("I am intern or someone else");
        console.log(user, "User details rendered and logged in successfully");
      }
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong while user login" });
  }
};

//forgot password

const forgotPassword = async (req, res) => {
  try {
    console.log("in forgot password api");
    const payload = req.body; //takes only email id and search it in the database
    console.log(payload);
    console.log(payload.email, "########");
    const userData = await employeeModel.findOne({ email: payload.email });
    console.log(userData.id);
    if (!userData) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const token = jwt.sign(userData.id, process.env.SECRET_KEY); //generate login token
    console.log(token, "##########");
    const find = await employeeModel.findOne({ _id: userData.id });
    console.log(find, "%%%%%%%%%%%%%%%%%%%%%");
    const updatedUser = await employeeModel.findByIdAndUpdate(
      userData.id,
      { $set: { token: token } },
      //  {new:true},
      { upsert: true, new: true }
    );
    console.log(updatedUser, "user updated successfully");
    // res.status(200).json(updatedUser);

    //nodemailer function

    async function main(payload, token) {
      console.log("in nodemailer fuction");
      console.log(typeof payload);
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          port: 5000,
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.SENDER_MAIL, // generated ethereal user
            pass: process.env.SENDER_PASSWORD, // generated ethereal password
          },
        });

        let mailOptions = {
          from: process.env.SENDER_MAIL,
          to: process.env.RECEIVER_MAIL,
          subject: "Password reset link for user " + " " + payload.email,
          html:
            "<p> Hi" +
            " " +
            payload.email +
            "," +
            "\n" +
            'Please, <a href="http://localhost:3001/forgotpassword?token=' +
            token +
            '">Click here</a> and reset your password</p>',
        };

        transporter.sendMail(mailOptions, function (err, info) {
          if (err) {
            console.log(err);
            return;
          }
          console.log("Email has been sent");
        });
      } catch (error) {
        // res.status(500).json({ message: "Something went wrong while sending the mail" });
      }
    }

    main(payload, token).catch(console.error); //nodemailer function called

    res
      .status(200)
      .json({ message: "Password reset link has been sent to your mail" });
  } catch (error) {
    res.status(400).json("something went wrong while resetting the password");
  }
};

//reset password

const resetPassword = async (req, res) => {
  try {
    console.log("In password reset api")
    const token = req.query.token;
    const payload = req.body
    console.log(token,"This is token")
    const url = req.url;
    console.log(url);
    // const payload = req.body
    // console.log(payload.password)
    console.log("we are in reset password", token);
    const tokenData = await employeeModel.findOne({ token: token });
    console.log(tokenData);
    if (!tokenData) {
      console.log("This link has been expired");
      res.status(404).json({ message: "This link has been expired" });
      return;
    } else {
      const password = req.body.password;
      const encryptedPassword = jwt.sign(
        password,
        process.env.SECRET_KEY
      ).toString();
      const updatedUser = await employeeModel.findByIdAndUpdate(
        tokenData.id,
        { $set: { password: encryptedPassword, token: " " } },
        //  {new:true},
        { upsert: true, new: true }
      );
      console.log("Password has been changed successfully");
      res.status(200).json({
        message: "Password has been changed successfully",
        updatedUser,
      });
    }
  } catch (error) {
    res
      .status(200)
      .json({ message: "something went wrong while resetting the password" });
  }
};
const forget = async(req,res)=>{
  const token = req.query.token
  console.log(token)
  console.log("hello")
}

//ejs

const index = async (req, res) => {
  res.render("index");
  console.log("page rendered successfully");
};

const loginPage = async (req, res) => {
  try {
    // const ejs = await getAllUser();
    res.render("loginPage", { title: "EJS formatting table" });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong while login" });
  }
};

const adminLoginPage = async (req, res) => {
  try {
    // const ejs = await getAllUser();
    res.render("adminLoginPage", { title: "EJS formatting table" });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong while login" });
  }
};
const adminLoginAuth = async (req, res) => {
  try {
    // const ejs = await getAllUser();
    res.render("loginPage1", { title: "EJS formatting table" });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong while login" });
  }
};

const forgotPasswordPage = async (req, res) => {
  res.render("forgotPasswordPage");
};

const resetPasswordPage = async (req, res) => {
  // res.render("resetPasswordPage");

  const token = req.query.token;
  console.log(token);
  res
    //   .cookie("auth", token, {expires: new Date("12/31/2100"), //httpOnly: true,
    //    signed: true,
    // })
    .status(200)
    .setHeader("reset-auth-token", token)
    .render("resetPasswordPage");
};
const userProfilePage = async (req, res) => {
  res.render("userProfile");
};

module.exports = {
  page,
  employeeRegistration,
  login,
  getAllEmployee,
  singleEmployee,
  adminRegistration,
  getAllAdmin,
  adminLogin,
  // managerRegistration,
  // getAllManager,
  // managerLogin,
  index,
  // login,
  loginPage,
  adminLoginPage,
  adminLoginAuth,
  forgotPassword,
  resetPassword,
  forget,
  forgotPasswordPage,
  resetPasswordPage,
  userProfilePage,
};

// const adminRegistration = async (req, res) => {
//   try {
//     console.log("1")
//     const payLoadValue = req.body;
// if (Schema.validate(payload).error) {
//   res
//   .status(422)
//   .json({ message: "Admin not added.Please check email and password" });
//   console.log("2")
//   return;
// }
// const payLoadValue = Schema.validate(payload).value;

//     console.log(payLoadValue);
//     if (payLoadValue.password != payLoadValue.confirmPassword) {
//       console.log("3")
//       console.log("password and confirm password is not same");
//       res
//       .status(400)
//       .json({ message: "password and confirm password is not same" });
//       return;
//     }

//     console.log("4")
//     const adminExist = await adminModel.findOne({
//       username: payLoadValue.username,
//     });
//     if (!adminExist) {
//       console.log("5")
//       const encryptedPassword = CryptoJS.AES.encrypt(
//         payLoadValue.password,
//         process.env.SECRET_KEY
//         ).toString();
//         const saveAdmin = {
//           username: payLoadValue.username,
//           password: encryptedPassword,
//         };
//         console.log("6")
//         const save = await new adminModel(saveAdmin).save();
//         console.log("Admin registered successfully");
//         res.status(200).json(save);
//         return;
//     } else {
//       res.status(400).json({ message: "admin already exist" });
//     }
//   } catch (error) {
//     res.status(400).json("something went wrong");
//   }
// };

// const adminLogin = async (req, res) => {
//   try {
//     const payload = req.body;
//     // console.log(payload, "$$$$$$$$$$$")
//     const getAdmin = await adminModel.findOne({email:payload.email});
//     console.log(getAdmin, "******************");
//     if (getAdmin.password !== payload.password) {
//       res.status(400).json({ message: "Admin Password does not match" });
//       return;
//     }

//     const data = await employeeModel.find({});
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(400).json({ message: "Something went wrong while Admin login" });
//   }
// };

// const adminLogin = async (req, res) => {
//   console.log("In adminLogin");
//   try {
//     const payload = req.body;
//     console.log(payload);
//     if (Schema.validate(payload).error) {
//       res.status(422).json({
//         message: "Admin not Logged in.Please check email and password",
//       });
//       return;
//     }
//     const payLoadValue = Schema.validate(payload).value;
//     console.log(payLoadValue.email);
//     const user = await adminModel.findOne({
//       email: payLoadValue.email,
//     });
//     console.log(user);

//     if (!user) {
//       return res.status(403).json({ message: "User Name Not Found " });
//     }
//     const data = user.password;
//     console.log(data, "Above decrypt block");
//     const decrypted = CryptoJS.AES.decrypt(
//       data,
//       process.env.secret_key
//     ).toString(CryptoJS.enc.Utf8);
//     console.log(decrypted, "decrypted password");
//     console.log(payLoadValue.password, "password in the body");
//     if (payLoadValue.password !== decrypted) {
//       res.status(401).json({ message: "password incorrect" });
//       return;
//     }
//     console.log(
//       "decrypted password matched with user credentials successfully"
//     );
//     // res.status(200).json({ message: "Logged in successfully" });
//     //generation of login token
//     token = jwt.sign(payLoadValue, process.env.SECRET_KEY); //generate login token
//     console.log(token);
//     // window.localStorage.setItem('x-auth-token', token);
//     // const renderPanel = await employeeModel.find({});
//     // console.log(renderPanel)
//     // res
//     //   .cookie("auth", token, {expires: new Date("12/31/2100"), //httpOnly: true,
//     //    signed: true,
//     // })
//     // .status(200)
//     // .setHeader("x-auth-token", token)
//     // .render("index", { records: renderPanel, hello: "hello" });
//     // .json(user)
//     res.status(200).json({ user }).setHeader("x-auth-token", token);
//     console.log("LOGIN TOKEN GENERATED SUCCESSFULLY");
//   } catch (error) {
//     res.status(400).json("something went wrong while login");
//   }
// };

//###################  MANAGER  ###################

// //manager registration
// const managerRegistration = async (req, res) => {
//   try {
//     const payload = req.body;
//     // console.log(payload,"#######################################################")
//     const managerExist = await managerModel.findOne({email:payload.email});
//     console.log(managerExist,"*****************************")
//     if (!managerExist) {
//       const savedUser = await new managerModel(payload).save();
//       res.status(200).json(savedUser);
//       return;
//     }
//     res.status(400).json({ message: "Manager already exist" });
//   } catch (error) {
//     res
//       .status(400)
//       .json({ message: "Something went wrong while Manager registration" });
//   }
// };

// //get All managers
// const getAllManager = async (req,res) => {
//   try {
//     const data = await managerModel.find({})
//     console.log(data)
//     res.status(200).json(data)
//   } catch (error) {
//     res.status(400).json({ message: "Something went wrong while fetching list of all admin" });
//   }
// }

// //manager login
// const managerLogin = async (req, res) => {
//   try {
//     console.log("#############****************")
//     const payload = req.body;
//     // console.log(payload, "$$$$$$$$$$$")
//     const getManager = await managerModel.findOne({email:payload.email});
//     console.log(getManager, "******************");
//     if (getManager.password !== payload.password) {
//       res.status(400).json({ message: "Manager's Password does not match" });
//       return;
//     }

//     const data = await employeeModel.find({dept:getManager.dept})
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(400).json({ message: "Something went wrong while Manager login" });
//   }
// };

// const login = async(req,res) => {
//   res.render('login')
//   console.log("login page rendered")
// }
