const express = require("express");
const bodyParser = require("body-parser");

const videosRoutes = require("./routes/videos-routes");

const app = express();

app.use("/api/videos", videosRoutes); // middleware

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

app.listen(5000);
