const mongoose = require('mongoose');
const message = new mongoose.Schema({
   name: {
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
});

module.exports = mongoose.model('message', message);
