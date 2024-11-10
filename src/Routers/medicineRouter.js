const express = require("express");
const medController = require("../controllers/medicineController.js");
const router = express.Router();

// Route to create a new medication
router.post("/create", medController.createMedication);

// Route to get all medications for a user
router.get("/user/:username", medController.getMedicationsByUser);

// Route to add a dose to a medication
router.put("/add-dose", medController.addDoseToMedication);

//edit inventory
router.put("/inventory/edit", medController.editInventory);

// Route to delete a dose to a medication
router.delete("/dose", medController.deleteDoseFromMedication);

// update the data
// router.put('/api/medication/:med_name', medController.updateMedicine);

module.exports = router;
