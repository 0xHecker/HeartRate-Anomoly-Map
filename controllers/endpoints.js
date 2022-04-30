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

    let str = `${revsearch}?at=${result.location.coordinates[0]}%2C${result.location.coordinates[1]}&apiKey=${hereapikey}&lang=en`;
    console.log(str);
    let rest = await axios.get(str);
    console.log(rest.data.items[0].title);
    console.log(rest.data.items[0].address);

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require("twilio")(accountSid, authToken);

    await client.messages
      .create({
        body: `
You are my emergency contact. I need help.

Device ID: ${result.deviceId}

Last detected location of the device is: ${rest.data.items[0].address.label} , ${rest.data.items[0].address.city} , ${rest.data.items[0].address.postalCode}

https://www.google.com/maps/place/${result.location.coordinates[0]},${result.location.coordinates[1]}

You might need to check on this person, Remember that the person who needs help might not be able to return your call.

You'll get this message when the person who added you as an emergency contact when the monitering device detects a heart rate anomaly it might be because they suddenly got panic too.
        `,
        from: "+19707038559",
        to: "+919398824920",
      })
      .then((message) => console.log(message.sid));
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
  const data = await Data.findByIdAndUpdate(id, { helpStatus: status, name: 'Sai Shanmukh' });
  res.status(200).json({
    success: true,
    message: "Data updated successfully",
    data: data
  });
};
