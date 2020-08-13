const jwt = require("jsonwebtoken");
const User = require("../models/users");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");

// const { sendWelcomeEmail, sendCancelationEmail } = require("../email/account");
const { errMessage, successMessage } = require("../helper/resmessage");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const signup = async (req, res) => {
  console.log(req);
  const { email, password, firstname, lastname } = req.body;
  const oldusers = await User.findOne({ email });

  // check if the user already exist
  if (oldusers) {
    return res.status(400).json({ message: errMessage("Email already exist") });
  }

  //   generate tokens
  const token = jwt.sign(
    { firstname, lastname, email, password },
    process.env.JWT_ACCOUNT_ACTIVATION,
    { expiresIn: "10m" }
  );

  //   send email to user for verification

  const emailData = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Account activation link`,
    html: `
       <h1>Please use the following link to activate your account</h1>
       <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
       <hr />
       <p>This email may contain sensetive information</p>
       <p>${process.env.CLIENT_URL}</p>
   `,
  };

  sgMail
    .send(emailData)
    .then((sent) => {
      console.log("SIGNUP EMAIL SENT", sent);
      return res.json({
        message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
      });
    })
    .catch((err) => {
      // console.log('SIGNUP EMAIL SENT ERROR', err)
      return res.status(404).json({
        message: err,
      });
    });
  // res.status(200).send({token})
};

const accountActivation = (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (
      err,
      decoded
    ) {
      if (err) {
        console.log("JWT VERIFY IN ACCOUNT ACTIVATION ERROR", err);
        return res.status(401).json({
          error: "Expired link. Signup again",
        });
      }

      const { firstname, lastname, email, password } = jwt.decode(token);

      const user = new User({ firstname, lastname, email, password });

      user.save((err, user) => {
        if (err) {
          console.log("SAVE USER IN ACCOUNT ACTIVATION ERROR", err);
          return res.status(401).json({
            error: "Error saving user in database. Try signup again",
          });
        }
        return res.json({
          message: "Signup success. Please signin.",
        });
      });
    });
  } else {
    return res.json({
      message: "Something went wrong. Try again.",
    });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  // check if user exists
  try {
    const user = await User.findByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ user, token, message: successMessage("Login") });
  } catch (error) {
    res
      .status(403)
      .json({ error: "user does not exist please check the login details" });
  }
};
// const loginUser = async (req, res) => {
//   try {
//     const user = await User.findByCredentials(
//       req.body.email,
//       req.body.password
//     );
//     const token = await user.generateAuthToken();
//     res.json({ data: user, token, message: successMessage("Login") });
//   } catch (error) {
//     res.status(400).json(error);
//   }
// };

const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
  } catch (error) {
    res.status(500).json();
  }
};

const logoutAll = (req, res) => {
  try {
    req.user.tokens = [];
    req.user.save();
  } catch (error) {
    res.status(500).json();
  }
};

const forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, {
      expiresIn: "10m",
    });

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Password Reset link`,
      html: `
                <h1>Please use the following link to reset your password</h1>
                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `,
    };

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        console.log("RESET PASSWORD LINK ERROR", err);
        return res.status(400).json({
          error: "Database connection error on user password forgot request",
        });
      } else {
        sgMail
          .send(emailData)
          .then((sent) => {
            // console.log('SIGNUP EMAIL SENT', sent)
            return res.json({
              message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
            });
          })
          .catch((err) => {
            // console.log('SIGNUP EMAIL SENT ERROR', err)
            return res.json({
              message: err.message,
            });
          });
      }
    });
  });
};

const resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (!resetPassword || !newPassword) {
    res
      .status(404)
      .json({ error: "newPassord cant be empty or you are authorized" });
  }
  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (
      err,
      decoded
    ) {
      if (err) {
        return res.status(400).json({
          error: "Expired link. Try again",
        });
      }

      User.findOne({ resetPasswordLink }, (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: "Something went wrong. Try later",
          });
        }

        const updatedFields = {
          password: newPassword,
          resetPasswordLink: "",
        };

        user = _.extend(user, updatedFields);

        user.save((err, result) => {
          if (err) {
            return res.status(400).json({
              error: "Error resetting user password",
            });
          }
          res.json({
            message: `Great! Now you can login with your new password`,
          });
        });
      });
    });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = (req, res) => {
  const { idToken } = req.body;

  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then((response) => {
      // console.log('GOOGLE LOGIN RESPONSE',response)
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, firstname, lastname, role } = user;
            return res.json({
              token,
              user: { _id, email, firstname, lastname, role },
            });
          } else {
            const nameArray = name.split(" ");
            let password = email + process.env.JWT_SECRET;
            user = new User({
              firstname: nameArray[1],
              lastname: nameArray[0],
              email,
              password,
            });
            user.save((err, data) => {
              if (err) {
                console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "User signup failed with google",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, email, firstname, lastname, role } = data;
              return res.json({
                token,
                user: { _id, email, firstname, lastname, role },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google login failed. Try again",
        });
      }
    });
};

const facebookLogin = (req, res) => {
  console.log("FACEBOOK LOGIN REQ BODY", req.body);
  const { userID, accessToken } = req.body;

  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

  return (
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      // .then(response => console.log(response))
      .then((response) => {
        const { email, name } = response;
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, lastname, firstname, role } = user;
            return res.json({
              token,
              user: { _id, email, lastname, firstname, role },
            });
          } else {
            // const nameArray = name.split(" ");
            let password = email + process.env.JWT_SECRET;
            user = new User({
              firstname: name,
              lastname: name,
              email,
              password,
            });
            user.save((err, data) => {
              if (err) {
                console.log("ERROR FACEBOOK LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "User signup failed with facebook",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, email, firstname, lastname, role } = data;
              return res.json({
                token,
                user: { _id, email, firstname, lastname, role },
              });
            });
          }
        });
      })
      .catch((error) => {
        res.json({
          error: "Facebook login failed. Try later",
        });
      })
  );
};

module.exports = {
  signup,
  accountActivation,
  signin,
  // loginUser,
  logoutAll,
  logout,
  forgotPassword,
  resetPassword,
  googleLogin,
  facebookLogin,
};
