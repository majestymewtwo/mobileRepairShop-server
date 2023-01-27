const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model.data");
const Query = require("./models/query.model");
const Repair = require("./models/repair.model");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const url =
  "mongodb+srv://server-user:H5WRMqSOBMwAPWqM@mobilerepairshop.una1bdt.mongodb.net/?retryWrites=true&w=majority";
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

//Database Server Port
mongoose.connect(url, connectionParams).then(()=>console.info("Connected to DB")).catch((e)=>console.info("Error : ", e));

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Server Deployment checking
app.get('/', async (req,res) => {
  res.send("Server is running");
})

//User Registration
app.post(`/api/register`, async (req, res) => {
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      contactNo: req.body.contactNo,
      gender: req.body.gender,
      address: req.body.address,
      email: req.body.email,
      password: newPassword,
    });
    res.json({status:'ok', user:true});
  } catch (err) {
    console.log(err);
    res.json({status: 'error', user:false});
  }
});

//Login Authentication
app.post(`/api/login`, async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    res.json({ status: "error", user: false });
  } else {
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (isPasswordValid) {
      const token = jwt.sign(
        {
          name: user.name,
          email: user.email,
        },
        "secret123"
      );
      res.json({ status: "success", user: token });
    } else {
      res.json({ status: "error", user: false });
    }
  }
});

//Login Autherization
app.get(`/api/user`, async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, "secret123");
    const cuser = await User.findOne({
      email: decoded.email,
    });
    res.json({ status: "ok", user: true, curr: cuser });
  } catch (error) {
    res.json({ status: "error", user: false });
  }
});

//Contact Us Query
app.post(`/api/contact`, async (req, res) => {
  try {
    const query = await Query.create({
      name: req.body.name,
      email: req.body.email,
      contactNo: req.body.contactNo,
      message: req.body.message,
    });
    res.json({ status: "ok", query: true });
  } catch (err) {
    res.json({ status: "error", query: false });
  }
});


//Repair
app.post(`/api/repair`, async (req, res) => {
  try {
    const newRepair = await Repair.create({
      brand: req.body.brand,
      model: req.body.model,
      imei: req.body.imei,
      status: req.body.status,
      description: req.body.description,
      type: req.body.type,
      email: req.body.email,
      order: req.body.order,
      collect: req.body.collect,
      repair: req.body.repair,
      deliver: req.body.deliver,
    });
    res.json({ status: "ok", repair: true });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", repair: false });
  }
});

//Get Repairs
app.post(`/api/repairs`, async (req, res) => {
  try {
    const repairs = await Repair.find({
      email: req.body.email,
    });
    res.json({ status: "ok", list: repairs });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", list: false });
  }
});

app.listen(process.env.PORT || 1337, (req,res) => {
  console.log("Server Started");
})