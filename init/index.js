const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

const MONGO_URI = "mongodb://127.0.0.1:27017/wanderspot";

main()
  .then(() => "Connection Successful")
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URI);
  await initDB();
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("Data was initialized successfully");
};
