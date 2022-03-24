const mongoose = require("mongoose");
const dataSchema = require("../models/HeartSchema");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Conected to mongoDB");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
