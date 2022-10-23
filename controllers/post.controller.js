// const RoleModel = require('../models/RoleModel');

const postController = {
    renderPostPage: (req, res) => {
        res.render("../views/components/post", { title: "Post Apartment" });
}
}

module.exports = postController;