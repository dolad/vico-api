const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();

const {
  signin,
  accountActivation,
  forgotPassword,
  resetPassword,
  signup,
  googleLogin,
  facebookLogin,
} = require("../controllers/auth");

const {
  userSignupValidator,
  userSigninValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../helper/expressvalidation");

const { runValidation } = require("../helper/validation");

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/account-activation", accountActivation);
router.post("/signin", userSigninValidator, runValidation, signin);

router.put(
  "/forgot-password",
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);
router.put(
  "/reset-password",
  resetPasswordValidator,
  runValidation,
  resetPassword
);

router.post("/google-login", googleLogin);

router.post("/facebook-login", facebookLogin);

// router.post("/users/login", loginUser);

// router.post("/users/logout", auth, logout);

// router.post("/users/logoutAll", auth, logoutAll);

module.exports = router;
