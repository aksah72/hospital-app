const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctor: String,
  date: String,
  patient: String
});

module.exports = mongoose.model("Appointment", appointmentSchema);
