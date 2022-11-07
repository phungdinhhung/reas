const mongoose = require("mongoose");
const favorite = new mongoose.Schema(
  {
    userId: {
      type: Object,
      default: ""
    },
    apartmentId: {
      type: Object,
      default: ""
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("favorite", favorite);