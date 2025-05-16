const express = require("express");
const {
  getAllAdmins,
  signup,
  updateAdmin,
  deleteAdmin,
  login,
} = require("../controller/adminController");

const router = express.Router();

router.route("/").get(getAllAdmins);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/:id").patch(updateAdmin).delete(deleteAdmin);

module.exports = router;
