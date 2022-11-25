const mongoose = require('mongoose');
const message = new mongoose.Schema(
   {
      username: {
         type: String,
         default: '',
      },
      email: {
         type: String,
         default: '',
      },
      phonenumber: {
         type: String,
         default: '',
      },
      content: {
         type: String,
         default: '',
      },
   },
   { timestamps: true },
);

module.exports = mongoose.model('message', message);
