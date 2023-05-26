const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const invoiceController = require("../controllers/invoiceController");

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

        cb(null, true);
        // cb(null, true);
        // if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        // } else {
        //     cb(null, false);
        //     return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        // }
    }
})

router.get("/", invoiceController.invoice_index);
router.get("/single/:id", invoiceController.invoice_single);

module.exports = router;