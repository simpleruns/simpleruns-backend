const express = require("express");
const router = express.Router();
const settingController = require("../controllers/settingController");

router.get('/positions', settingController.position_index);
router.post("/positions/create", settingController.position_create);
router.delete("/positions/:id", settingController.position_delete);
router.get("/tolls", settingController.tolls_index);
router.post("/tolls/update", settingController.tolls_update);

module.exports = router;
