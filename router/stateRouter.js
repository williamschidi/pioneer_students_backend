const express = require("express");

const {
  CreateStates,
  getAllStates,
  updateState,
  deleteState,
} = require("../controller/stateController");

const router = express.Router();

router.route("/").get(getAllStates).post(CreateStates);
router.route("/:id").patch(updateState).delete(deleteState);

module.exports = router;
