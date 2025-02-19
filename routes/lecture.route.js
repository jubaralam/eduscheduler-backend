const express = require("express");
const lectureRouter = express.Router();
const UserModel = require("../models/user.model");
const CourseModel = require("../models/course.model");
const LectureModel = require("../models/lecture.model");
const mongoose = require("mongoose");
const authorizedAdmin = require("../middleware/authorizedAdmin");

lectureRouter.post("/assign", authorizedAdmin, async (req, res) => {
  try {
    const { courseId, instructorId, topic, start_time, end_time } = req.body;

    // Convert start_time and end_time to Date objects
    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    if (!courseId || !instructorId || !topic || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Fetch instructor
    const instructor = await UserModel.findOne({
      _id: instructorId,
      role: "instructor",
    });

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found or not valid",
      });
    }

    // Check if instructor already has a lecture at the same time
    const existingLecture = await LectureModel.findOne({
      instructorId,
      $or: [
        { start_time: { $lt: endTime }, end_time: { $gt: startTime } }, // Overlapping time
      ],
    });

    if (existingLecture) {
      return res.status(403).json({
        success: false,
        message: "Instructor already has a lecture at this time.",
      });
    }

    // Create a new lecture document
    const newLecture = new LectureModel({
      courseId,
      instructorId,
      topic,
      start_time: startTime,
      end_time: endTime,
    });

    // Save lecture in the database
    await newLecture.save();

    res.status(200).json({
      success: true,
      message: "Lecture assigned successfully!",
      lecture: newLecture,
    });
  } catch (error) {
    console.error("Error assigning lecture:", error);
    res.status(500).json({
      success: false,
      message: "Error assigning lecture",
    });
  }
});

lectureRouter.get("/get/:courseId", authorizedAdmin, async (req, res) => {
  try {
    const courseId = new mongoose.Types.ObjectId(req.params.courseId); // Convert to ObjectId

    const assignedLectures = await LectureModel.aggregate([
      {
        $match: { courseId: courseId },
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "courseData",
        },
      },
      {
        $project: {
          _id: 1,

          courseData: 1,
          instructorId: 1,
          start_time: 1,
          end_time: 1,
        },
      },
    ]);

    if (assignedLectures.length === 0) {
      return res.status(404).send({ message: "Lecture not found" });
    }

    res.status(200).send({ data: assignedLectures });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

lectureRouter.get("/gets", authorizedAdmin, async (req, res) => {
  try {
    const assignedLectures = await LectureModel.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "courseData",
        },
      },
      {
        $project: {
          _id: 1,

          courseData: 1,
          instructorId: 1,
          start_time: 1,
          end_time: 1,
        },
      },
    ]);

    if (assignedLectures <= 0) {
      return res.status(404).send({ message: "Lecture not found" });
    }

    res.status(200).send({ data: assignedLectures });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

lectureRouter.get("/get-assigned/:instructorId", async (req, res) => {
  try {
    const instructorId = new mongoose.Types.ObjectId(req.params.instructorId); // Convert to ObjectId

    const assignedLectures = await LectureModel.aggregate([
      {
        $match: { instructorId: instructorId },
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "courseData",
        },
      },
      {
        $project: {
          _id: 1,

          courseData: 1,
          instructorId: 1,
          start_time: 1,
          end_time: 1,
        },
      },
    ]);

    if (assignedLectures.length === 0) {
      return res.status(404).send({ message: "Lecture not found" });
    }

    res.status(200).send({ data: assignedLectures });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = lectureRouter;
