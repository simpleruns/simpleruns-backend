const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const customerController = require("../../controllers/customerController");

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

router.get("/", upload.single('avatar'), customerController.customer_index);
router.post("/create", customerController.customer_create);
router.put('/:id', upload.single('avatar'), customerController.customer_update);


router.get("/:id", customerController.customer_getOne);
router.put('/approve/:id', customerController.customer_approve);

router.delete("/:id", customerController.customer_delete);


module.exports = router;