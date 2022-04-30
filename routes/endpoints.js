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

router.get("/update/:id/:status", (req, res) => {
  res.render("update", {id: req.params.id, status: req.params.status});
});

router.route("/update/:id/:status").post(update);



router.post("/register", (req, res) => {
  res.send(req.body);
});

module.exports = router;
