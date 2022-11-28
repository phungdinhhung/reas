const userModel = require('../models/user.model');
const apartmentModel = require('../models/apartment.model');
const resultOfSearch = async (req, res, next) => {
   const role = req.cookies.user;
   let listRoom = [];
   const { region, price, acreage } = req.body;

   if (region !== '' && price === '' && acreage === '') {
      listRoom = await apartmentModel.find({ region: region });
   } else if (price !== '' && region === '' && acreage === '') {
      listRoom = await apartmentModel.find({ price: { $lt: price } });
   } else if (acreage !== '' && region === '' && price === '') {
      listRoom = await apartmentModel.find({ acreage: { $lt: acreage } });
   } else if (acreage !== '' && region !== '' && price !== '') {
      listRoom = await apartmentModel.find({
         $and: [{ acreage: { $lt: acreage } }, { price: { $lt: price } }, { region: region }],
      });
   }
   res.status(200).render('components/search', { title: 'Result Search', listRoom, role });
};
module.exports = {
   resultOfSearch,
};
