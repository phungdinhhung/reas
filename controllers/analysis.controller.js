const apartmentModel = require('../models/apartment.model');

const analysisController = {
   getAnalysisPage: async (req, res) => {
      try {
         const user = req.cookies.user;
         const apartmentId = req.params;
         const apartmentRender = req.params.id;
         const { price } = req.body;
         const apartment = await apartmentModel.findOne({ _id: apartmentId.id });
         const max = apartment.price + (apartment.price * 10) / 100;
         if (price >= apartment.price && price <= max) {
            apartment.price = price;
         } else {
            req.flash('success', 'Giá không hợp lệ');
            res.redirect(`/detail/${apartmentRender}`);
         }

         const { type } = req.body;
         let change = [];
         if (type.includes('70')) {
            change.push({ percent: 70, moneyPhase: (apartment.price * 70) / 100 });
            change.push({ percent: 25, moneyPhase: (apartment.price * 25) / 100 });
            change.push({ percent: 5, moneyPhase: (apartment.price * 5) / 100 });
            apartment.phase = change;
         } else if (type.includes('90')) {
            change.push({ percent: 95, moneyPhase: (apartment.price * 95) / 100 });
            change.push({ percent: 5, moneyPhase: (apartment.price * 5) / 100 });
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
         console.log(type);
         res.render('../views/components/analysis', {
            apartment,
            user,
            phase,
            type,
         });
      } catch (e) {
         console.log(e);
      }
   },
};

module.exports = analysisController;
