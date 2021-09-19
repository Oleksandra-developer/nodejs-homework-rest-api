const jimp = require("jimp");
const path = require("path");
const fs = require("fs/promises");
const createFolderIsNotExist = require("../helpers/folderCreater");

class UploadAvatarService {
  constructor(folderAvatars) {
    this.folderAvatars = folderAvatars;
  }

  async editAvatar(pathFile) {
    const image = await jimp.read(pathFile);
    await image
      .autocrop()
      .cover(
        250,
        250,
        jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE
      )
      .writeAsync(pathFile);
  }

  async saveAvatar({ userId, file }) {
    await this.editAvatar(file.path);
    const folderUserAvatar = path.join(this.folderAvatars, userId);
    await createFolderIsNotExist(folderUserAvatar);
    await fs.rename(file.path, path.join(folderUserAvatar, file.filename));
    return path.normalize(path.join(userId, file.filename));
  }
}

module.exports = UploadAvatarService;
