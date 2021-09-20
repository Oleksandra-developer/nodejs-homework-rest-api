const fs = require("fs/promises");
const isAssesible = (path) => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};

const createFolderIsNotExist = async (folder) => {
  if (!(await isAssesible(folder))) {
    await fs.mkdir(folder);
  }
};
module.exports = createFolderIsNotExist;
