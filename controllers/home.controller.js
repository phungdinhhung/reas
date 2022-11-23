const roleModel = require('../models/role.model');
const apartmentModel = require('../models/apartment.model');

const homeController = {
   getHomePage: async (req, res) => {
      try {
         const user = req.cookies.user;
         let userId = '',
            role = '';
         if (user) {
            userId = req.cookies.user.user_id;
            role = await roleModel.findOne({ userId: userId });
         }
         const listRegion1 = await apartmentModel.find({
            region: 'Miền Bắc',
         });
         const listRegion2 = await apartmentModel.find({
            region: 'Miền Trung',
         });
         const listRegion3 = await apartmentModel.find({
            region: 'Miền Nam',
         });
         res.render('./components/index', { title: 'REAS', user, listRegion1, listRegion2, listRegion3 });
      } catch (e) {
         console.log(e);
         res.status(500).json(e);
      }
   },
   getSearchPage: async (req, res) => {
      res.redirect('/search');
   },
};

module.exports = homeController;
