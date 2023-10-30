const Contributor = require("../models/contributorModel");

const getContribByBudgetID = async (req, res) => {
  try {
    const result = await Contributor.findAll({
      where: { budget_id: req.body.budget_id },
      attributes: [
        ["id", "contributor_id"],
        "contributor_name",
        "salary",
        "active",
        "budget_id",
      ],
    });
    if (result) {
      return res.status(200).json(result);
    }
    return res
      .status(400)
      .json({ message: "No contributors found for this budget." });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const addContributor = async (req, res) => {
  try {
    await Contributor.create({
      contributor_name: req.body.contributor_name,
      salary: req.body.salary,
      active: true,
      budget_id: req.body.user_id,
    });
    const result = await Contributor.findOne({
      where: {
        user_id: req.body.contributor_name,
        budget_id: req.body.budget_id,
      },
      attributes: [
        ["id", "contributor_id"],
        "contributor_name",
        "salary",
        "active",
        "budget_id",
      ],
    });
    if (result) {
      return res.status(200).json(result);
    }
    return res
      .status(204)
      .json({ message: "Couldn't return added contributor." });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
const updateContributor = async (req, res) => {
  try {
    const result = await Contributor.findByPk(req.body.contributor_id);
    if (result) {
      await Contributor.update(
        {
          contributor_name: req.body.contributor_name,
          salary: req.body.salary,
          active: req.body.active,
          budget_id: req.body.budget_id,
        },
        { where: { id: req.body.contributor_id } }
      );
      return res.status(200).json(result);
    }
    return res
      .status(204)
      .json({ message: "Couldn't return updated contributor." });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const deleteContributor = async (req, res) => {
  try {
    const result = await Contributor.findByPk(req.body.contributor_id);
    if (result) {
      await Contributor.destroy({ where: { id: req.body.contributor_id } });
      return res.status(200).json({
        message: `The following contributor record has been deleted:`,
        result,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports = {
  getContribByBudgetID,
  addContributor,
  updateContributor,
  deleteContributor,
};
