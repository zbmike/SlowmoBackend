const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const videosRoutes = require("./routes/videos-routes");
const partiesRoutes = require("./routes/parties-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const cred = require("./secret");

const app = express();

app.use(bodyParser.json()); // middlewares

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/parties", partiesRoutes);
app.use("/api/videos", videosRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

mongoose
  .connect(
    `mongodb+srv://${cred.mongodbcred}@slowmovideo.qcnzp.mongodb.net/videos?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000);
  })
  .catch();
