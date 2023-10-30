const express = require("express");
const router = express.Router();
const {
  getPayCheckByContribID,
  addPayCheck,
  updatePayCheck,
  deletePayCheck,
} = require("../controllers/contributorController");

router.get("/", getPayCheckByContribID);
router.post("/", addPayCheck);
router.put("/", updatePayCheck);
router.delete("/", deletePayCheck);

module.exports = router;
