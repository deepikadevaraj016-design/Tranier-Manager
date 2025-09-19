const Trainer = require('../models/trainer');
const Course = require('../models/course')

exports.createTrainer = async (req, res) => {
  const { name, email, phone, courseId, notes } = req.body;

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized: User not found" });
    }

    const newTrainer = new Trainer({
      user: req.user.id,
      name,
      email,
      phone,
      course: courseId,
      notes
    });

    const savedTrainer = await newTrainer.save();

    await savedTrainer.populate("course", "name code");

    res.status(201).json({
      msg: "New Trainer saved successfully",
      trainer: savedTrainer
    });

  } catch (err) {
    console.error("Trainer Create Error:", err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

exports.getTrainer = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const trainers = await Trainer.find({ user: req.user.id }).populate("course","name code").sort({ createdAt: -1 });
    res.status(200).json(trainers)
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.updateTrainer = async (req, res) => {
  const { name, email, phone, courseId, notes } = req.body;

  try {
    let trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });

    if (trainer.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });


    trainer = await Trainer.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, course: courseId, notes },
      { new: true }
    ).populate("course", "name code");

    
    res.status(200).json({msg: "Trainer detail updated successfully",trainer });

  } catch (err) {
    console.error("Update Trainer Error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });

    if (trainer.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Trainer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Trainer data deleted successfully" });

  } catch (err) {
    console.error("Delete Trainer Error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
