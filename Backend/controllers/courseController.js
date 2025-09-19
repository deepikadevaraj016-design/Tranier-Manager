const Course = require('../models/course');


exports.createCourse = async (req, res) => {
  const { name, code } = req.body;
  try {
    if (!name || !code) {
      return res.status(400).json({ msg: "Name and Code are required" });
    }
    const existing = await Course.findOne({ code });
    if (existing) {
      return res.status(409).json({ msg: "Course with this code already exists" });
    }
    const course = new Course({ name, code });
    await course.save();
    res.status(201).json({ msg: "Course created successfully", course });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error", error: err.message });
  }
};


exports.getCourse = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (err) {
    return res.status(500).json({ msg: "Server Error", error: err.message });
  }
};


exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: "Course not found" });
    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};


exports.updateCourse = async (req, res) => {
  const { name, code } = req.body;
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { name, code },
      { new: true }
    );
    if (!course) return res.status(404).json({ msg: "Course not found" });
    res.status(200).json({ msg: "Course updated successfully", course });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ msg: "Course not found" });
    res.status(200).json({ msg: "Course deleted successfully" });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error", error: err.message });
  }
};
