const express = require("express");
const multer = require("multer");
const { auth, isAdmin } = require("../middlewares/auth");
const router = express.Router();
const {
  uploadProfileImage,
  deleteProfileImage,
  getCurrentUser,
  getUserProfile,
  updateUser,
  deleteUser,
} = require("../controllers/user");

router.get("/users/:id", auth, getCurrentUser);

router.get("/welcome", (req, res) => {
  res.send("welcome");
});

router.patch("/users/update", auth, updateUser);
router.put("/admin/update", auth, isAdmin, updateUser);

// const avatar = multer({
//   limits: {
//     fieldSize: 1000000,
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//       return cb(new Error("Please upload a word document"));
//     }

//     cb(undefined, Error);
//   },
// });

// router.post(
//   "/users/me/avatar",
//   auth,
//   avatar.single("avatar"),
//   uploadProfileImage,
//   (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
//   }
// );

// router.delete("/users/me/avatar", auth, deleteProfileImage);

// //  get user profiles

// router.get("/users/:id/avatar", getUserProfile);

// router.delete("/users/me", deleteUser);

module.exports = router;
