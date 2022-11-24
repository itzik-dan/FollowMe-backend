const path = require("path");
const cors = require("cors");
const express = require("express");

const app = express();
app.use(cors());

require("dotenv").config();
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware.js");

//db
connectDB();

//Middleware for accepting json data in the req body
app.use(express.json({ limit: "50mb" }));

// Look inside public folder to look for static files such as css, images etc.
app.use("/", express.static(path.join(__dirname, "../public")));

app.use("/", require("./routes/root"));

// routes middleware
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));
app.use(require("./routes/uploadImage"));

// Catch all the routes that reaches here after fail to match the routes above
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
