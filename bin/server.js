const app = require("../app");
const db = require("../model/db.js");
const createFolderIsNotExist = require("../helpers/folderCreater");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const TEMPORARY_DIR = process.env.TEMPORARY_DIR;
const AVATARS_FOR_PUBLICATION = process.env.AVATARS_FOR_PUBLICATION;

db.then(() => {
  app.listen(PORT, async () => {
    await createFolderIsNotExist(TEMPORARY_DIR);
    await createFolderIsNotExist(AVATARS_FOR_PUBLICATION);
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch((err) => {
  console.log(`Error:${err.message}`);
});
