

const homeController = { 
    getHomePage: async(req, res) => {
        try {
        res.render("./components/index", {title: "REAS"})
    } catch(e) {
        console.log(e);
        res.status(500).json(e);
    }
}
}

module.exports = homeController