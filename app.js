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
app.use(AuthRouter);
app.use(userRouter);
app.use(expenseRouter);
app.use(serviceRouter);
app.use(assetRouter);

module.exports = app;
