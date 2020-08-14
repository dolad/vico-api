const app = require("./app");
const express = require("express");
const path = require("path");
const port = process.env.PORT || 8000;

//__________ listening form the port________

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build"));
//   });
// }

app.listen(port, () => {
  console.log("app is running on port : " + port);
});
