const express = require("express");

const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("./../controller/memberController");

const router = express.Router();

// routes
router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").patch(updateUser).delete(deleteUser);

module.exports = router;
