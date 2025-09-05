require('dotenv').config();
const express = require("express");
const { connectToMongodb } = require("./connection");
const UrlRoute = require("./routes/url");
const URL = require("./models/url");
const path=require('path');
const staticRouter=require("./routes/staticRouter");
const userRoute=require('./routes/user');
const cookieParser=require("cookie-parser");
const {checkForAuthentication,restrictTo}=require("./middlewares/auth");
const {redirectToUrl}=require("./controllers/url");


const app = express();
const port = 8001;

connectToMongodb(process.env.MONGO_URL).then(() =>
  console.log("Connected to mongodb successfully")
);
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.use(cookieParser());
app.use(express.json()); 
app.use(express.urlencoded({extended:false}));
app.use(checkForAuthentication);
app.use("/url",restrictTo("NORMAL"),UrlRoute);
app.use("/",staticRouter);
app.use("/user",userRoute);
app.get("/:shortid", redirectToUrl);

app.listen(port, () => console.log(`Listening at port ${port}`));
