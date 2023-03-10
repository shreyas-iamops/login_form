const { auth } = require("../middleware/auth");

const {
  page,
  employeeRegistration,
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
    forgotPasswordPage,
    resetPasswordPage,
    forget,
    userProfilePage,
    login,
    
  } = require("../controller/controller");
  
  const appRouter = require("express").Router();

  appRouter.post("/login", login);
  appRouter.get("/ok", page);

  //employee Registration route
  appRouter.get("/getAllEmployee", getAllEmployee);
  appRouter.get("/singleEmployee/:id", singleEmployee);
  appRouter.post("/employeeRegistration", employeeRegistration);
  
  
  //routes for admin
  appRouter.get("/getAllAdmin", getAllAdmin);
  appRouter.get("/adminLogin", adminLoginAuth);
  appRouter.post("/adminRegistration", adminRegistration);
  appRouter.post("/adminLogin", adminLogin);
  
  
  // //routes for manager
  // appRouter.get("/getAllManager", getAllManager);
  // appRouter.post("/managerRegistration", managerRegistration);
  // appRouter.post("/managerLogin", managerLogin);

  //forgot password
  appRouter.get("/forgotPasswordPage", forgotPasswordPage);
  appRouter.get("/resetPassword", resetPasswordPage);
  appRouter.post("/forgotPassword", forgotPassword);
  appRouter.post("/resetPassword", resetPassword);
  // appRouter.get("http://localhost:3001/forgotpassword?token=", forget);

  
  //render ejs page
  appRouter.get("/renderPage", index);
  // appRouter.get("/login", login);
  appRouter.get("/loginPage", loginPage);
  appRouter.get("/adminLoginPage", adminLoginPage);
  appRouter.get("/userProfilePage", userProfilePage);

  
  
  
  module.exports = {
    appRouter,
  };
  