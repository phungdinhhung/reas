const apartmentModel = require('../models/apartment.model');
const roleModel = require('../models/role.model');

const analysisController = {
   getAnalysisPage: async (req, res) => {
      try {
         const user = req.cookies.user;
         let userId, role;
         if (user) {
            userId = req.cookies.user.user_id;
            role = await roleModel.findOne({ userId: userId });
         }
         const apartmentId = req.params;
         const apartmentRender = req.params.id;
         const { price, yearVnh, inputInterest } = req.body;
         const interest = [];
         const debt = [];
         const earned = [];
         const apartment = await apartmentModel.findOne({ _id: apartmentId.id });
         const max = apartment.price + (apartment.price * 10) / 100;
         if (price >= apartment.price && price <= max) {
            apartment.price = price;
         } else {
            req.flash('fail', 'Giá không hợp lệ');
            res.redirect(`/detail/${apartmentRender}`);
         }

         const { type } = req.body;
         let change = [];
         if (type.includes('70')) {
            change.push({ percent: 70 });
            change.push({ percent: 25 });
            change.push({ percent: 5 });
            apartment.phase = change;
         } else if (type.includes('90')) {
            change.push({ percent: 90 });
            change.push({ percent: 10 });
            apartment.phase = change;
         } else if (type.includes('vnh')) {
            change.push({ percent: 20 });
            change.push({ percent: 45 });
            change.push({ percent: 10 });
            change.push({ percent: 20 });
            change.push({ percent: 5 });
            apartment.phase = change;
         }

         const phase = apartment.phase;
         res.render('../views/components/analysis', {
            apartment,
            user,
            phase,
            type,
            yearVnh,
            interest,
            debt,
            earned,
            role,
            inputInterest,
            alert: req.flash('success'),
            fail: req.flash('fail'),
         });
      } catch (e) {
         console.log(e);
      }
   },
};

module.exports = analysisController;
