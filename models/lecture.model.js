const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true,
      index: true, 
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true, 
    },
    topic: { type: String, required: true, trim: true },
    start_time: { type: Date, required: true },
    end_time: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.start_time;
        },
        message: "End time must be after start time.",
      },
    },
  },
  { timestamps: true }
);

const LectureModel = mongoose.model("Lecture", lectureSchema);

module.exports = LectureModel;
