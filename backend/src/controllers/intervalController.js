const Interval = require("../models/intervalModel");

const getIntervals = async (req, res) => {
  try {
    const result = await Interval.findAll({
      attributes: [
        ["id", "interval_id"],
        "interval_name",
        "description",
        "num_days",
      ],
    });
    if (result) {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports = { getIntervals };
