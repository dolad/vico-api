require("dotenv").config();
const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const expenseRouter = require("./routers/expenses");
const serviceRouter = require("./routers/services");
const assetRouter = require("./routers/assets");
const AuthRouter = require("./routers/auth");

const cors = require("cors");
const morgan = require("morgan");

const app = express();

//___________ routers____________//

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/api", AuthRouter);
app.use("/api", userRouter);
app.use("/api", expenseRouter);
app.use("/api", serviceRouter);
app.use("/api", assetRouter);

module.exports = app;
