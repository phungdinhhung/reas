const mongoose = require('mongoose');
const contact = new mongoose.Schema(
   {
      fullname: {
         type: String,
         default: '',
      },
      phonenumber: {
         type: Number,
         default: 0,
      },
      email: {
         type: String,
         default: '',
      },
      apartmentname: {
         type: String,
         default: '',
      },
   },
   { timestamps: true },
);

module.exports = mongoose.model('contact', contact);
