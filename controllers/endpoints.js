// @desc Using this file to define my endpoints
// @route GET /api/v1/
// @access public
const mongoose = require("mongoose");
const axios = require("axios");
const dataSchema = require("../models/HeartSchema");
const Data = mongoose.model("Data", dataSchema);
const revsearch = "https://revgeocode.search.hereapi.com/v1/revgeocode";
const hereapikey = process.env.HERE_API_KEY;

exports.getanomal = async (req, res, next) => {
  try {
    const data = await Data.find({
      date: {
        $lt: Date.now(),
        $gt: new Date(Date.now() - 60 * 60 * 1000),
      },
      isAnomal: true,
    });
    console.log(data);
    return res.status(200).json({
      success: true,
      message: "data fetched successfully",
      data: data,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Cannot fetch data from DB",
    });
  }

  //{
  //   $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
  // }
};

exports.getdata = async (req, res, next) => {
  try {
    const data = await Data.find();
    return res.status(200).json({
      success: true,
      message: "data fetched successfully",
      data: data,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Cannot fetch data from DB",
    });
  }

  //{
  //   $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
  // }
};

exports.sayhello = async (req, res, next) => {
  console.log("Hello fom the otherside");
  res.send("Hello from the otherside");
};

//   res.status(200).json({
//     success: true,
//     message: "Coordinates fetched successfully",
//     data: {
//       latitude: req.latitude,
//       longitude: req.longitude,
//     },
//   });

exports.addAddress = async (req, res, next) => {
  try {
    let { isAnomal, latitude, longitude, BPM, helpStatus, deviceId } = req.body;
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    BPM = parseInt(BPM);
    let isTrueSet = isAnomal === "true";

    let datas = new Data({
      isAnomal: isTrueSet,
      BPM: BPM,
      helpStatus: helpStatus,
      deviceId: deviceId,
      location: {
        type: "Point",
        coordinates: [latitude, longitude],
        index: "2dsphere",
      },
    });

    const result = await datas.save();

    let str = `${revsearch}?at=${result.location.coordinates[0]}%2C${result.location.coordinates[1]}&lang=en-US&apikey=${hereapikey}`;
    console.log(str);
    let rest = await axios.get(str);
    console.log(rest.data.items[0].address);

    console.log(result);
    res.status(200).json({
      success: true,
      message: "Data added successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
    });
  }
};

function validate(req, res) {
  const { id, status } = req.params;
  const arr = ["resolved", "unresolved", "helpfound"];
  if (!arr.find((item) => item === status)) {
    res.status(400).json({
      success: false,
      message: "Invalid status",
    });
  }
}

exports.update = async (req, res) => {
  const { id, status } = req.params;
  validate(req, res);
  const data = await Data.findByIdAndUpdate(id, { helpStatus: status });
  res.status(200).json({
    success: true,
    message: "Data updated successfully",
    data: data,
  });
};
