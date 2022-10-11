const mongoose = require("mongoose");
const apartment = new mongoose.Schema(
  {
    type: {
      type: String,
      default: ""
    },
    price: {
      type: String,
      default: ""
    },
    acreage: {
      type: Number,
      default: 0
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
    address: {
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
    username: {
      type: String,
      default: "",
    },
    userId: {
      type: Object,
      default: "",
    },
    isAccept: {
      type: Boolean,
      default: false,
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