const userModel = require('../models/user.model');
const apartmentModel = require('../models/apartment.model');
const resultOfSearch = async (req, res, next) => {
   const user = req.cookies.user;
   let listApartment = [];
   const { region, price, acreage } = req.body;

   if (region !== '' && price === '' && acreage === '') {
      listApartment = await apartmentModel.find({ region: region });
   } else if (price !== '' && region === '' && acreage === '') {
      listApartment = await apartmentModel.find({ price: { $lte: price } });
   } else if (acreage !== '' && region === '' && price === '') {
      listApartment = await apartmentModel.find({ acreage: { $lte: acreage } });
   } else if (acreage !== '' && region !== '' && price !== '') {
      listApartment = await apartmentModel.find({
         $and: [{ acreage: { $lte: acreage } }, { price: { $lte: price } }, { region: region }],
      });
   }
   res.status(200).render('components/search', {
      title: 'Result Search',
      listApartment,
      user,
      alert: req.flash('success'),
      fail: req.flash('fail'),
      
   });
};
module.exports = {
   resultOfSearch,
};
