const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const driverController = require("../../controllers/driverController");

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

        // cb(null, true);
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
})

router.get("/", driverController.driver_index);
router.post("/create", upload.fields([{ name: 'avatar', maxCount: 1 }, { name: "licensePhoto", maxCount: 10 }]), driverController.driver_create);
router.put('/:id', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: "licensePhoto", maxCount: 10 }]), driverController.driver_update);

router.get("/:id", driverController.driver_getOne);

router.put('/approve/:id', driverController.driver_approve);

router.delete("/:id", driverController.driver_delete);


module.exports = router;