const app = require("./app");
const express = require("express");
const path = require("path");
const port = process.env.PORT || 8000;

//__________ listening form the port________

if (process.env.NODE_ENV === "production") {
  console.log(port);
}

app.listen(port, () => {
  console.log("app is running on port : " + port);
});
