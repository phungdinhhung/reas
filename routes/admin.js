const router = require("express").Router();
const dotenv = require('dotenv');
const adminController = require("../controllers/admin.controller");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
});

const upload = multer({ storage: storage });

router.get("/", adminController.renderdashboardPage);

router.get("/upload", adminController.getUploadPage);
router.post("/upload/post", upload.array("files", 4), adminController.PostUpload);
module.exports = router;
