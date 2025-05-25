const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Booking = require("../models/CaregiverBooking");
const Caregiver = require("../models/caregiverModel");
const {
  acceptBooking,
  rejectBooking,
} = require("../controllers/caregiverController");
const nodemailer = require("nodemailer");

router.post("/", auth, async (req, res) => {
  try {
    const { caregiverId, date, startTime, endTime, specialInstructions } =
      req.body;

    const caregiver = await Caregiver.findById(caregiverId);
    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }

    const existingBooking = await Booking.findOne({
      caregiver: caregiverId,
      date,
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "This time slot is already booked" });
    }

    const booking = new Booking({
      caregiver: caregiverId,
      user: req.user.id,
      date,
      startTime,
      endTime,
      specialInstructions,
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/user", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate(
      "caregiver",
      "name specialization profileImage"
    );
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/admin", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const bookings = await Booking.find()
      .populate("caregiver", "name specialization")
      .populate("user", "name email");
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/status", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/accepted", acceptBooking);
router.put("/:id/rejected", rejectBooking);

module.exports = router;
