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

router.post("/api/signup", userSignupValidator, runValidation, signup);
router.post("/api/account-activation", accountActivation);
router.post("api/signin", userSigninValidator, runValidation, signin);

router.put(
  "api/forgot-password",
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);
router.put(
  "api/reset-password",
  resetPasswordValidator,
  runValidation,
  resetPassword
);

router.post("api/google-login", googleLogin);

router.post("api/facebook-login", facebookLogin);

// router.post("/users/login", loginUser);

// router.post("/users/logout", auth, logout);

// router.post("/users/logoutAll", auth, logoutAll);

module.exports = router;
