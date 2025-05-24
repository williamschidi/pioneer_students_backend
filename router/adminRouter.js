const express = require("express");
const {
  getAllAdmins,
  signup,
  updateAdmin,
  deleteAdmin,
  login,
  logout,
  protect,
  verified,
} = require("../controller/adminController");

const router = express.Router();

router.route("/").get(getAllAdmins);
router.route("/protected").get(protect, (req, res) => {
  res.json({
    id: req.admin.id,
    firstName: req.admin.firstName,
  });
});
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/verify").get(protect, verified);
router.route("/:id").patch(updateAdmin).delete(deleteAdmin);

module.exports = router;
