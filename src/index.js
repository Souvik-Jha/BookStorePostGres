const express = require("express");
const bodyParser = require("body-parser");
const route = require("./Routes/route");
// const multer = require("multer")
const app = express();

//------------------- Global or Application level Middleware-------------------//
app.use(bodyParser.json());
// app.use(multer().any()); 
app.use(bodyParser.urlencoded({ extended: true }));

 
app.use("/", route);

app.use("*", (req, res) => {
  return res
    .status(400)
    .send({ status: false, message: "please enter valid url endpoint" });
});

//------------------- Server Configuration -------------------//

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});