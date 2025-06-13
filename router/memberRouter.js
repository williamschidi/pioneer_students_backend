const express = require("express");

const multer = require("multer");
const { storage } = require("./../config/cloudinaryConfig");
const upload = multer({ storage });

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getSearchedUsers,
} = require("./../controller/memberController");
const { protect } = require("./../controller/adminController");

const router = express.Router();

// routes

router.route("/search").get(getSearchedUsers);
router
  .route("/")
  .get(getUsers)
  .post(protect, upload.single("profilePic"), createUser);

router
  .route("/:id")
  .get(getUser)
  .patch(upload.single("profilePic"), updateUser)
  .delete(protect, deleteUser);

module.exports = router;
