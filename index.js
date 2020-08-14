const app = require("./app");
const cors = require("cors");
const displayRoutes = require("express-routemap");

const port = process.env.PORT;
console.log(port);
//__________ listening form the port________

if (process.env.NODE_ENV === "production") {
  console.log(port);
}

if ((process.env.NODE_ENV = "development")) {
  app.use(cors({ origin: `http://localhost:3000` }));
}

app.listen(port, () => {
  console.log("app is running on port : " + port);
  displayRoutes(app);
});
