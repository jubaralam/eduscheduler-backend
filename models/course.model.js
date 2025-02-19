const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    poster: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    mode: { type: String, required: true },
    level: { type: String, required: false, default: "beginner" },
    language: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const CourseModel = mongoose.model("course", courseSchema);

module.exports = CourseModel;
