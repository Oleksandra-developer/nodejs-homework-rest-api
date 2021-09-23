const fs = require("fs/promises");

const checkAsses = (path) => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};

const createFolderIsNotExist = async (folder) => {
  const isAssesible = await checkAsses(folder);
  if (!isAssesible) {
    await fs.mkdir(folder);
  }
};
module.exports = createFolderIsNotExist;
