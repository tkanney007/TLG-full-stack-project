const Budget = require("../models/budgetModel");

const getBudgetsByUserID = async (req, res) => {
  try {
    const result = await Budget.findAll({
      where: { user_id: req.body.user_id },
      attributes: [["id", "budget_id"], "budget_name", "user_id"],
    });
    if (result) {
      return res.status(200).json(result);
    }
    return res.status(400).json({ message: "No budgets found for this user." });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const addBudget = async (req, res) => {
  try {
    await Budget.create({
      budget_name: req.body.budget_name,
      user_id: req.body.user_id,
    });
    const result = await Budget.findOne({
      where: { user_id: req.body.user_id, budget_name: req.body.budget_name },
      attributes: [["id", "budget_id"], "budget_name", "user_id"],
    });
    if (result) {
      return res.status(200).json(result);
    }
    return res.status(204).json({ message: "Couldn't return added budget." });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const updateBudget = async (req, res) => {
  try {
    const result = await Budget.findByPk(req.body.budget_id);
    if (result) {
      await Budget.update(
        { budget_name: req.body.budget_name },
        { where: { id: req.body.budget_id } }
      );
      const updatedResult = await Budget.findByPk(req.body.budget_id);
      return res.status(200).json(updatedResult);
    }
    return res.status(204).json({ message: "Couldn't return updated budget." });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const result = await Budget.findByPk(req.body.budget_id);
    if (result) {
      await Budget.destroy({ where: { id: req.body.budget_id } });
      return res.status(200).json({
        message: `The following budget record has been deleted:`,
        result,
      });
    }
    return res.status(204).json({
      message: "Couldn't delete budget record because it could not be found.",
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports = {
  getBudgetsByUserID,
  addBudget,
  updateBudget,
  deleteBudget,
};
