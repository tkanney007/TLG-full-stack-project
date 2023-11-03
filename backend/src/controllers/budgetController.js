const Budget = require("../models/budgetModel");

const getBudgetsByUserID = async (req, res) => {
  // Get budget with the user id parameter
  await Budget.findAll({
    where: { user_id: req.params.user_id },
    attributes: [["id", "budget_id"], "budget_name", "user_id"],
  })
    .then((result) => {
      console.log(result);
      //if there are no budgets to retrieve then return nothing but success and a message
      if (!result.length) {
        return res.status(404).json({
          success: true,
          message: "No budgets found for this user.",
        });
        // if budgets found then return them
      } else {
        return res.status(200).json({
          success: true,
          message: "Budgets retrieved for user provided.",
          result,
        });
      }
    })
    .catch((error) => {
      return res
        .json({
          success: false,
          message: "An error occurred.",
          error: error,
        })
        .status(500);
    });
};

const addBudget = async (req, res) => {
  await Budget.create({
    budget_name: req.body.budget_name,
    user_id: req.body.user_id,
  })
    .then(async (result) => {
      await Budget.findOne({
        where: { user_id: req.body.user_id, budget_name: req.body.budget_name },
        attributes: [["id", "budget_id"], "budget_name", "user_id"],
      })
        .then((result) => {
          console.log(result.dataValues);
          if (!result.dataValues) {
            return res
              .json({
                success: true,
                message: "Couldn't return added budget.",
              })
              .status(204);
          } else {
            res
              .json({
                success: true,
                message: "Budget successfully added.",
                result,
              })
              .status(200);
          }
        })
        .catch((error) => {
          return res
            .status(500)
            .json({
              success: false,
              message: "An error occurred.",
              error: error,
            })
            .status(500);
        });
    })
    .catch((error) => {
      return res
        .json({
          success: false,
          message: "An error occurred.",
          error: error,
        })
        .status(500);
    });
};

const updateBudget = async (req, res) => {
  // get the budget from the budget id in the request ody
  const budgetResult = await Budget.findByPk(req.body.budget_id).catch(
    (error) => {
      return res
        .json({
          success: false,
          message: "An error occurred.",
          error: error,
        })
        .status(500);
    }
  );
  console.log(budgetResult);
  //if you can't find the budget notify with success = false
  if (budgetResult == null) {
    return res
      .json({
        success: false,
        message:
          "Cannot update budget because it was not found with the given budget id.",
      })
      .status(404);
  }
  // if budgets found then update them
  await Budget.update(
    { budget_name: req.body.budget_name },
    { where: { id: req.body.budget_id } }
  )
    .then(async (result) => {
      console.log("********************UPDATE RESULTS:", result);
      //find the record after the update
      const updatedResult = await Budget.findByPk(req.body.budget_id).catch(
        (error) => {
          return res
            .json({
              success: false,
              message: "An error occurred.",
              error: error,
            })
            .status(500);
        }
      );
      //if the updated record can't be found return a message
      if (!updatedResult.dataValues) {
        return res
          .json({
            success: true,
            message: "Cannot retrieve budget record after update.",
          })
          .status(204);
      }
      // if you made it here the record was updated and could be found afterward so send success true and the updatedResult
      res
        .json({
          success: true,
          message: "Budget successfully updated.",
          updatedResult,
        })
        .status(200);
    })
    .catch((error) => {
      return res
        .json({
          success: false,
          message: "An error occurred.",
          error: error,
        })
        .status(500);
    });
};

const deleteBudget = async (req, res) => {
  const result = await Budget.findByPk(req.params.budget_id).catch((error) => {
    return res
      .json({
        success: false,
        message: "An error occurred.",
        error: error,
      })
      .status(500);
  });
  if (result == null) {
    return res
      .json({
        success: false,
        message:
          "Cannot delete budget because it was not found with the given budget id.",
      })
      .status(404);
  }
  await Budget.destroy({ where: { id: req.params.budget_id } })
    .then((deleteResult) => {
      if (!deleteResult) {
        return res
          .json({
            success: false,
            message: "Unable to delete budget",
          })
          .status(204);
      }
      return res
        .json({
          message: `The following budget record has been deleted:`,
          result,
        })
        .status(200);
    })
    .catch((error) => {
      return res
        .json({
          success: false,
          message: "An error occurred.",
          error: error,
        })
        .status(500);
    });
};

module.exports = {
  getBudgetsByUserID,
  addBudget,
  updateBudget,
  deleteBudget,
};
