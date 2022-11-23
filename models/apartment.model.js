const mongoose = require('mongoose');
const phases = new mongoose.Schema({
   percent: {
      type: Number,
      default: '',
   },
   moneyPhase: {
      type: Number,
      dafault: '',
   },
});
const image = new mongoose.Schema({
   url: {
      type: String,
      default: '',
   },
});
const like = new mongoose.Schema({
   userId: {
      type: Object,
      default: '',
   },
});
const apartment = new mongoose.Schema(
   {
      price: {
         type: Number,
         default: 0,
      },
      acreage: {
         type: Number,
         default: 0,
      },
      region: {
         type: String,
         default: '',
      },
      city: {
         type: String,
         default: '',
      },
      district: {
         type: String,
         default: '',
      },
      ward: {
         type: String,
         default: '',
      },
      address: {
         type: String,
         default: '',
      },
      beach: {
         type: String,
         default: '',
      },
      heading: {
         type: String,
         default: '',
      },
      description: {
         type: String,
         default: '',
      },
      userId: {
         type: Object,
         default: '',
      },
      priceMonth: {
         type: Number,
         default: 0,
      },
      phase: [phases],
      listLike: [like],
      images: [image],
   },
   { timestamps: true },
);

module.exports = mongoose.model('Apartment', apartment);
