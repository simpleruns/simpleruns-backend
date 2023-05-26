const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const settingController = require("../controllers/settingController");

const DIR = './public/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

router.get('/positions', settingController.position_index);
router.post("/positions/create", settingController.position_create);
router.delete("/positions/:id", settingController.position_delete);
router.get("/tolls", settingController.tolls_index);
router.post("/tolls/update", settingController.tolls_update);
router.get("/user/:id", settingController.user_index);
router.put("/user/:id", upload.single('logo'), settingController.user_update);
router.get("/googleapi/:id", settingController.google_map),
    module.exports = router;
