const express = require("express");
const courseRouter = express.Router();

const auth = require("../middleware/auth");
const authorizedAdmin = require("../middleware/authorizedAdmin");

const CourseModel = require("../models/course.model");

courseRouter.post("/create", [auth, authorizedAdmin], async (req, res) => {
  const { poster, title, description, mode, language, level } = req.body;
  const user_id = req.user._id;

  try {
    if (!poster || !title || !description || !mode || !language) {
      return res.status(401).send({ message: "All fields are required" });
    }
    const course = CourseModel({
      user_id,
      poster,
      title,
      description,
      mode,
      language,
      level,
    });

    await course.save();
    res.status(200).send({ message: "new course has been added" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//get a course by course id
courseRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const course = await CourseModel.findById({ _id: id });
    if (!course) {
      return res.status(404).send({ message: "course not found" });
    }
    res.status(201).send({ data: course });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// get all courses
courseRouter.get("/", async (req, res) => {
  try {
    const courses = await CourseModel.find();
    if (courses <= 0) {
      return res.status(404).send({ message: "course not found" });
    }

    res.status(200).send({ data: courses });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// update course
courseRouter.put("/update/:id", [auth, authorizedAdmin], async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const update = await CourseModel.findByIdAndUpdate({ _id: id }, data, {
      new: true,
    });

    res.status(200).send({ message: "course has updated", data: update });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//course deletion
courseRouter.delete(
  "/delete/:id",
  [auth, authorizedAdmin],
  async (req, res) => {
    const { id } = req.params;
    console.log(req.user);
    try {
      const course = await CourseModel.findById({ _id: id });
      if (!course) {
        return res.status(404).send({ message: "course detail not found" });
      }
      const remove = await CourseModel.findByIdAndDelete({ _id: id });

      res.send({ message: "course has been deleted" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

module.exports = courseRouter;
