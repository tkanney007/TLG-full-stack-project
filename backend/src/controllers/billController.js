const PayDay = require("../models/payDayModel");
const Bill = require("../models/billModel");
const Interval = require("../models/intervalModel");
const BillDueDates = require("../models/billDueDatesModel");
const moment = require("moment");

const getBillsByBudgetID = async (req, res) => {
  try {
    const result = await Bill.findAll({
      where: {
        budget_id: req.body.budget_id,
      },
      attributes: [
        ["id", "bill_id"],
        "bill_name",
        "description",
        "amt_due",
        "day_due",
        "start_date",
        "website",
        "website_login",
        "active",
        "budget_id",
        "interval_id",
      ],
    });
    if (result) {
      return res.status(200).json(result);
    }
    return res.status(400).json({ message: "No bills found for this budget." });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const addBill = async (req, res) => {
  try {
    await Bill.create({
      bill_name: req.body.bill_name,
      description: req.body.description,
      amt_due: req.body.amt_due,
      day_due: req.body.day_due,
      monthly_same_day: true, // need to change this but for times sake just defaulting to true req.body.monthly_same_day,
      start_date: req.body.start_date,
      website: req.body.website,
      website_login: req.body.website_login,
      active: req.body.active,
      budget_id: req.body.budget_id,
      interval_id: req.body.interval_id,
    });
    const billResult = await Bill.findOne({
      where: {
        bill_name: req.body.pay_check_name,
        budget_id: req.body.budget_id,
      },
      attributes: [
        ["id", "bill_id"],
        "bill_name",
        "description",
        "amt_due",
        "day_due",
        "monthly_same_day",
        "start_date",
        "website",
        "website_login",
        "active",
        "budget_id",
        "interval_id",
      ],
    });

    if (billResult) {
      if (!createBillDueDates(billResult)) {
        await Bill.destroy({ where: { id: billResult.bill_id } });
        return res.status(500).json({
          message:
            "The following bill record was added but has subsequently been deleted because bill due dates couldn't be created for it:",
          billResult,
        });
      }
      return res.status(200).json(billResult);
    }
    return res.status(204).json({ message: "Couldn't return added bill." });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const createBillDueDates = async (bill) => {
  try {
    const interval = await Interval.findByPk(bill.interval_id);
    if (interval) {
      // create an array of billduedate objects that will be flushed to bill_due_dates table.
      //Load with the due date specified for bill object being added.
      let billDueDates = [
        {
          due_date: moment(bill.start_date).format("L"),
          budget_id: bill.budget_id,
          bill_id: bill.bill_id,
        },
      ];

      let nextBillDueDate;
      if (bill.monthly_same_day) {
        //get the dateparts of start date and subtract 1 from month as javascript months are 0 - 11
        let month = parseInt(moment(bill.start_date).format("MM"));
        let year = parseInt(moment(bill.start_date).format("YYYY"));
        let day = parseInt(moment(bill.start_date).format("DD"));
        //Create bill due dates for the next year on the same day for each month over that year.
        for (let i = 0; i < 12; i++) {
          //Create a date using moment from our date parts.
          let date = moment()
            .year(year)
            .month(month)
            .date(
              month == 1 && day > 28
                ? moment(year).isLeapYear()
                  ? 29
                  : 28
                : day
            ) // ternary logic to pick the last day of february if dat greater than 28
            .format("L");

          // Create bill due date object
          let billDueDate = {
            due_date: date,
            budget_id: bill.budget_id,
            bill_id: bill.bill_id,
          };
          // push bill due date object to the billDueDates array of objects.
          billDueDates.push(billDueDate);
          //increment the month for the next month bill due date
          month++;
          // if the month is greater than 11 (December) then we need to start over with zero (January) and increment the year.
          if (month > 11) {
            month = 0;
            year++;
          }
        }
      }
      // if the paydays array is empty return
      if (!billDueDates.length) {
        return false;
      }
      console.log(billDueDates);
      //Create all the paydays in the payday array
      await BillDueDates.bulkCreate(billDueDates);
      return true;
    }
  } catch (error) {
    console.log(
      `Error creating bill due dates for bill ${bill.bill_name} that belongs to budget id ${bill.budget_id}. Error message: ${error}.`
    );
    return false;
  }
};

const updateBill = async (req, res) => {
  try {
    // get the bill that will be updated so we can see what is different from db record and req object
    const billResult = await Bill.findByPk(req.body.bill_id, {
      attributes: [
        ["id", "bill_id"],
        "bill_name",
        "description",
        "amt_due",
        "day_due",
        "start_date",
        "website",
        "website_login",
        "active",
        "budget_id",
        "interval_id",
      ],
    });
    // Check if we found a bill record
    if (billResult) {
      // If we found a bill issue the update sent in request
      await Bill.update(
        {
          bill_name: req.body.bill_name,
          description: req.body.description,
          amt_due: req.body.amt_due,
          day_due: req.body.day_due,
          monthly_same_day: true, // need to change this but for times sake just defaulting to true req.body.monthly_same_day,
          start_date: req.body.start_date,
          website: req.body.website,
          website_login: req.body.website_login,
          active: req.body.active,
          budget_id: req.body.budget_id,
          interval_id: req.body.interval_id,
        },
        { where: { id: billResult.bill_id, budget_id: billResult.budget_id } }
      );
      // Get the updated bill
      const billUpdated = await Bill.findByPk(billResult.bill_id, {
        attributes: [
          ["id", "bill_id"],
          "bill_name",
          "description",
          "amt_due",
          "day_due",
          "start_date",
          "website",
          "website_login",
          "active",
          "budget_id",
          "interval_id",
        ],
      });
      // Check if the bill start date, day_due, amt_due changed
      if (
        moment(billResult.start_pay_date).format("L") !==
          moment(billUpdated.start_pay_date).format("L") ||
        billResult.day_due !== billUpdated.day_due ||
        billResult.amt_due !== billUpdated.amt_due
      ) {
        // If the bill start date, day_due, amt_due changed we need to delete all
        // the child bill due dates
        // and then recreate them with the new properties.
        await BillDueDates.destroy({
          where: {
            bill_id: billResult.bill_id,
            budget_id: billResult.budget_id,
          },
        });
        //Create all the bills with the new properties
        if (!createBillDueDates(billUpdated)) {
          // If the new bill can't be created delete the bill and make the user recreate it.
          // ****This should be reevaluated for a better way in the future****
          await Bill.destroy({
            where: { id: billResult.bill_id, budget_id: billResult.budget_id },
          });
          return res.status(500).json({
            message:
              "The following bill record was updated but has subsequently been deleted because bill due dates couldn't be created/updated for it after the bill updates. Please re-add the bill.:",
            billResult,
          });
        }
      }
      // Return the updated record
      return res.status(200).json(billUpdated);
    }
    return res.status(204).json({ message: "Couldn't update bill." });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const deleteBill = async (req, res) => {
  try {
    const billResult = await Bill.findByPk(req.body.bill_id, {
      attributes: [
        ["id", "bill_id"],
        "bill_name",
        "description",
        "amt_due",
        "day_due",
        "start_date",
        "website",
        "website_login",
        "active",
        "budget_id",
        "interval_id",
      ],
    });
    if (billResult) {
      await Bill.destroy({
        where: { id: billResult.bill_id, budget_id: billResult.budget_id },
      });
      return res.status(200).json({
        message: `The following bill record has been deleted:`,
        billResult,
      });
    }
    return res.status(204).json({
      message: "Couldn't delete bill record because it could not be found.",
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports = { getBillsByBudgetID, addBill, updateBill, deleteBill };
