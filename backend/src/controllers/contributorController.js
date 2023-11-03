const Contributor = require("../models/contributorModel");

const getContribByBudgetID = async (req, res) => {
  try {
    const result = await Contributor.findAll({
      where: { budget_id: req.params.budget_id },
      attributes: [
        ["id", "contributor_id"],
        "contributor_name",
        "salary",
        "active",
        "budget_id",
      ],
    });
    // .catch((error) => {
    //   return res
    //     .json({
    //       success: false,
    //       message: "An error occurred.",
    //       error: error,
    //     })
    //     .status(500);
    // });
    console.log(result);
    if (!result.length) {
      return res.status(404).json({
        success: true,
        message: "No contributors found for this budget.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Contributors retrieved for budget provided.",
      result,
    });
  } catch (error) {
    res
      .json({
        success: false,
        message: "An error occurred while fetching the contributor record(s).",
        error: error,
      })
      .status(500);
  }
};

const addContributor = async (req, res) => {
  try {
    await Contributor.create({
      contributor_name: req.body.contributor_name,
      salary: req.body.salary,
      active: true,
      budget_id: req.body.budget_id,
    });
    // .catch((error) => {
    //   return res
    //     .json({
    //       success: false,
    //       message: "An error occurred when creating the contributor record.",
    //       error: error,
    //     })
    //     .status(500);
    // });
    const result = await Contributor.findOne({
      where: {
        contributor_name: req.body.contributor_name,
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
    if (result == null) {
      return res
        .json({
          success: true,
          message: "Couldn't return added contributor.",
        })
        .status(204);
    }
    return res
      .json({
        success: true,
        message: "Contributor successfully added.",
        result,
      })
      .status(200);
  } catch (error) {
    res
      .json({
        success: false,
        message: "An error occurred when adding the contributor record.",
        error: error,
      })
      .status(500);
  }
};
const updateContributor = async (req, res) => {
  try {
    const result = await Contributor.findByPk(req.body.contributor_id);
    if (result == null) {
      return res
        .json({
          success: false,
          message:
            "Cannot update contributor because it was not found with the given contributor id.",
        })
        .status(404);
    }
    await Contributor.update(
      {
        contributor_name: req.body.contributor_name,
        salary: req.body.salary,
        active: req.body.active,
        budget_id: req.body.budget_id,
      },
      { where: { id: req.body.contributor_id } }
    );
    const updatedResult = await Contributor.findByPk(req.body.contributor_id);
    console.log(updatedResult);
    if (updatedResult == null) {
      return res
        .json({
          success: true,
          message: "Cannot retrieve contributor record after update.",
        })
        .status(204);
    }
    res
      .json({
        success: true,
        message: "Contributor successfully updated.",
        updatedResult,
      })
      .status(200);
  } catch (error) {
    res
      .json({
        success: false,
        message: "An error occurred when updating the contributor record.",
        error: error,
      })
      .status(500);
  }
};

const deleteContributor = async (req, res) => {
  try {
    const result = await Contributor.findByPk(req.params.contributor_id);
    if (result == null) {
      return res
        .json({
          success: false,
          message:
            "Couldn't delete contributor record because it could not be found.",
        })
        .status(404);
    }
    await Contributor.destroy({ where: { id: req.params.contributor_id } });
    return res
      .json({
        success: true,
        message: "Contributor successfully deleted.",
        result,
      })
      .status(200);
  } catch (error) {
    res
      .json({
        success: false,
        message: "An error occurred when deleting the contributor record.",
        error: error,
      })
      .status(500);
  }
};

module.exports = {
  getContribByBudgetID,
  addContributor,
  updateContributor,
  deleteContributor,
};
