const express = require("express");
const app = express();

const authRouter = require("./Routers/authRouter.js");
const medicineRouter = require("./Routers/medicineRouter.js");
const bodyparser = require("body-parser");
const MedID = require("./models/medID.js");

app.use(bodyparser.json());

app.use("/", authRouter);

app.use("/api/medication", medicineRouter);

app.put("/api/medication/:med_name", async (req, res) => {
  try {
    const medName = req.params.med_name;

    const updateData = {
      drug: req.body.drug,
      super_food: req.body.super_food || [],
      bad_food: req.body.bad_food || [],
      common_symptom: req.body.common_symptom || [],
      serious_symptom: req.body.serious_symptom || [],
      treatment: req.body.treatment || [],
    };

    const updatedMedicine = await MedID.findOneAndUpdate(
      { medName: medName },
      { $set: updateData },
      { new: true }
    );
    if (!updatedMedicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    res.status(200).json({
      message: "Medicine updated successfully",
      data: updatedMedicine,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update medicine",
      error: error.message,
    });
  }
});

module.exports = app;
