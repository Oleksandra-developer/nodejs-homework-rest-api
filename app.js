const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const helmet = require("helmet");
const contactsRouter = require("./routes/api/contacts");
const usersRouter = require("./routes/api/users");
const app = express();
const path = require("path");

const AVATARS_FOR_PUBLICATION = process.env.AVATARS_FOR_PUBLICATION;
const formatsLogger = app.get("env") === "development" ? "dev" : "short";
const fullPathToImages = path.join(__dirname, AVATARS_FOR_PUBLICATION);

app.use(helmet());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: 10000 }));

app.use(express.static(fullPathToImages));
app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);

app.use((req, res) => {
  res.status(404).json({ status: "error", code: 404, message: "Not found" });
});

app.use((err, req, res, next) => {
  const status = err.message || 500;
  res
    .status(status)
    .json({ status: "fail", code: status, message: err.message });
});

module.exports = app;
