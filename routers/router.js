const express = require("express");
const router = express.Router();
// const User = require('../models/user.js');
// const bcrypt = require('bcrypt');
// const { title } = require('process');
const { isAuthenticated } = require("../middlewares/auth.js");

const {
  loginPage,
  userSignUpPost,
  userLoginPost,
  userLoginGet,
  userSignUpGet,
  userHomeGet,
  logoutRoute
} = require("../controllers/userController.js");

const {
  adminLoginGet,
  adminPanelGet,
  adminLoginPost,
  adminEditGet,
  adminEditPost,
  adminDeletePost,
  adminSearchGet,
  adminCreateUserGet,
  adminSaveUserPost,
  adminLogoutRoute
} = require("../controllers/adminController.js");

//Login Page Route
router.get("/", loginPage);

// Signup route---------------------------
router.post("/SignUp", userSignUpPost);

//Login route-------------------------
router.post("/login", userLoginPost);

// Render Login Page---------------------
router.get("/login", userLoginGet);

// Render SignUp Page-------------------
router.get("/SignUp", userSignUpGet);

// Render Home Page--------------
router.get("/home", isAuthenticated, userHomeGet);

//Render Admin Login Page (GET request) ***********************
router.get("/admin/login", adminLoginGet);

//Admin Page ****************************
router.get("/admin", isAuthenticated, adminPanelGet);

//Admin login page**************************
router.post("/admin/login", adminLoginPost);

//***************Edit and delete page **************

router.get("/admin/edit/:id", isAuthenticated, adminEditGet);

// Saving the changes
router.post("/admin/edit/:id", isAuthenticated, adminEditPost);

router.post("/admin/delete/:id", isAuthenticated, adminDeletePost);

//************************************************//

// Search for a user in the admin login page
router.get("/search", isAuthenticated, adminSearchGet);

//Creating a user

router.get("/create", isAuthenticated, adminCreateUserGet);

//create-user ejs page

router.post("/save-user", isAuthenticated, adminSaveUserPost);

// Logout route*************************
router.get("/logout", logoutRoute);

router.get("/admin/logout", adminLogoutRoute);

module.exports = router;
