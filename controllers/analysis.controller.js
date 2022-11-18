const apartmentModel = require("../models/apartment.model")

const analysisController = {
    getAnalysisPage: async(req,res) => {
        try {
            const apartmentId = req.params;
            const apartment = await apartmentModel.findOne({ _id: apartmentId.id });
            const {type} = req.body;
            console.log(type);
            if(type.includes("normal")) {

            }

            res.render("../views/components/analysis",
            { apartment },
            )
        }catch(e) {
            console.log(e);
        }
    },
}

module.exports = analysisController;