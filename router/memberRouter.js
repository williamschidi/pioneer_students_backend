const express = require("express");

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUser,
} = require("./../controller/memberController");
const { protect } = require("../controller/adminController");

const router = express.Router();

// routes
router.route("/").get(getUsers).post(protect, createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
