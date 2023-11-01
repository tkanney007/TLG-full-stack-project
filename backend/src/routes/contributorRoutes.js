const express = require("express");
const router = express.Router();
const {
  getContribByBudgetID,
  addContributor,
  updateContributor,
  deleteContributor,
} = require("../controllers/contributorController");

router.get("/", getContribByBudgetID);
router.post("/", addContributor);
router.put("/", updateContributor);
router.delete("/", deleteContributor);

module.exports = router;
