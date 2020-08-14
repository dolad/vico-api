const app = require("./app");
const express = require("express");
const path = require("path");
const cors = require("cors");
const port = process.env.PORT || 8000;

//__________ listening form the port________

if (process.env.NODE_ENV === "production") {
  console.log(port);
}

if ((process.env.NODE_ENV = "development")) {
  app.use(cors({ origin: `http://localhost:3000` }));
}

app.listen(port, () => {
  console.log("app is running on port : " + port);
});
