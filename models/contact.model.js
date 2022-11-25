const mongoose = require('mongoose');
const contact = new mongoose.Schema(
   {
      userId: {
         type: String,
         default: '',
      },
      apartmentId: {
         type: String,
         default: '',
      },
   },
   { timestamps: true },
);

module.exports = mongoose.model('contact', contact);
