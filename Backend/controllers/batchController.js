const Batch = require('../models/batch');
const Trainer = require('../models/trainer');
const Course = require('../models/course'); 

exports.createBatch = async (req, res) => {
  const { name, intime, outtime, trainerId, courseId } = req.body;

  try {
    if (!name || !intime || !outtime || !trainerId || !courseId) {
      return res.status(400).json({ msg: "Fill all required fields" });
    }

    const trainer = await Trainer.findById(trainerId);
    if (!trainer) return res.status(404).json({ msg: "Trainer not found" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: "Course not found" });

    const newBatch = new Batch({
      name,
      intime,
      outtime,
      trainer: trainerId,
      course: {
        id: course._id,
        name: course.name 
      }
    });

    const savedBatch = await newBatch.save();
    res.status(201).json({ msg: "Batch created successfully", batch: savedBatch });

  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

exports.getBatch = async (req, res) => {
  try {
    const batches = await Batch.find()
      .populate("trainer", "name email phone")
      .sort({ createdAt: -1 });

    const formatted = batches.map(b => ({
      _id: b._id,
      name: b.name,
      intime: b.intime,
      outtime: b.outtime,
      trainerName: b.trainer?.name || "Unknown",
      courseName: b.course?.name || "Unknown"
    }));

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

exports.getBatchById = async (req, res) => {
  try {
    const b = await Batch.findById(req.params.id).populate("trainer", "name");
    if (!b) return res.status(404).json({ msg: "Batch not found" });

    res.json({
      _id: b._id,
      name: b.name,
      intime: b.intime,
      outtime: b.outtime,
      trainerId: b.trainer?._id,
      trainerName: b.trainer?.name,
      courseId: b.course?.id,
      courseName: b.course?.name
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

exports.updateBatch = async (req, res) => {
  const { name, intime, outtime, trainerId, courseId } = req.body;

  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ msg: "Batch not found" });

    // ✅ Update only provided fields
    if (name) batch.name = name;
    if (intime) batch.intime = intime;
    if (outtime) batch.outtime = outtime;

    if (trainerId) {
      const trainer = await Trainer.findById(trainerId);
      if (!trainer) return res.status(404).json({ msg: "Trainer not found" });
      batch.trainer = trainer._id;
    }

    if (courseId) {
      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ msg: "Course not found" });
      batch.course = { id: course._id, name: course.name };
    }

    const updated = await batch.save();
    res.status(200).json({ msg: "Batch updated successfully", batch: updated });

  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};


exports.deleteBatch = async (req, res) => {
  try {
    const existingBatch = await Batch.findById(req.params.id);
    if (!existingBatch) return res.status(404).json({ msg: "Batch not found" });

    await Batch.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Batch deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};
