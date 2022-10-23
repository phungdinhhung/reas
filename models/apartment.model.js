const mongoose = require("mongoose");
const apartment = new mongoose.Schema(
  {
    price: {
      type: String,
      default: ""
    },
    region: {
        type: String,
        default: "",
    },
    city: {
      type: String,
      default: "",
    },
    district: {
      type: String,
      default: "",
      },
    ward: {
      type: String,
      default: "",
    },
    beach: {
        type: String,
        default: "",
      },
    description: {
      type: String,
      default: "",
    },
    state: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: Object,
      default: "",
    },
    images: [image]
  },
  { timestamps: true }
  );
const image = new mongoose.Schema({
  url: {
    type: String,
    default: "",
  }
});

module.exports = mongoose.model("Apartment", apartment);