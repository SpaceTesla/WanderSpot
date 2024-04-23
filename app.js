const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const app = express();
const port = 8080;
const MONGO_URI = "mongodb://127.0.0.1:27017/wanderspot";

main()
  .then(() => "Connection Successful")
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URI);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// Home route
app.get("/", (req, res) => {
  res.send("Connected to the server");
});

// Show all listings route
app.get("/listings", async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index", { listings });
});

// Create new listing route (GET request to show the form)
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// Create new listing route (POST request to create the listing)
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

// Show individual listing route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/show", { listing });
});

// Edit listing route (GET request to show the form)
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
});

// Edit listing route (PUT request to update the listing)
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${listing._id}`);
});

// Delete listing route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

app.listen(port, () => console.log("Listening on port " + port));
