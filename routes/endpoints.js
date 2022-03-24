const express = require("express");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

const {
  sayhello,
  getanomal,
  addAddress,
  update,
  getdata,
} = require("../controllers/endpoints");

router.route("/getanomal").get(getanomal);

router.route("/getdata").get(getdata);

router.route("/sayhello").get(sayhello);

router.route("/post").post(addAddress);

router.route("/update/:id/:status").put(update);

module.exports = router;
