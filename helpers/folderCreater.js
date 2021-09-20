const fs = require("fs/promises");

const checkAccess = (path) => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};

const createFolderIsNotExist = async (folder) => {
  if (!(await checkAccess(folder))) {
    await fs.mkdir(folder);
  }
};
module.exports = createFolderIsNotExist;
