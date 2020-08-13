const expressJwt = require("express-jwt");
const User = require("../models/users");

const auth = expressJwt({
  secret: process.env.JWT_SECRET, // req.user
});

const isAdmin = async (req, res, next) => {
  const user = await User.findById({ _id: req.user._id });

  if (!user) {
    return res.status(400).json({
      error: "User not found",
    });
  }

  if (user.role !== "admin") {
    return res.status(400).json({
      error: "Admin resource. Access denied.",
    });
  }
  req.profile = user;
  next();
};

// const auth = async (req, res, next) => {
//     try {
//         // get token from bearer
//         const token = req.header('Authorization').replace('Bearer ', '');

//         // verify the token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         // use the id from the verify to find user that has stored token
//         const user = await User.findOne({_id : decoded._id, "tokens.token": token})

//         if(!user){
//             throw new Error();
//         }
//         req.token = token
//         req.user = user;
//         next();
//     } catch (e) {
//         res.status(401).send({error:'Please authenticate'});
//     }
// }

module.exports = {
    auth, isAdmin
};
