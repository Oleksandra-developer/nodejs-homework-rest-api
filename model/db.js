const mongoose = require("mongooose");
require("dotenv").config();
const UrlDb = process.env.DB_HOST;
const db = mongoose.connect(UrlDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  poolSize: 5,
});

mongoose.connection.on("connected", () => {
  console.log("Database connection successful");
});

mongoose.connection.on("error", (err) => {
  console.log(`Mongoose error ${err.message}`);
});

mongoose.connection.on("disconnected", (err) => {
  console.log(`Mongoose disconnected ${err.message}`);
  process.exit(1);
});

process.on("SIGINT", async () => {
  mongoose.connection.close(() => {
    console.log("Connection to db terminated");
    process.exit(1);
  });
});

module.export = db;
