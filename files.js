const fs = require('fs');
const path = require('path');

const files = (pathFile) => {
  if (!pathFile) {
    throw new Error('pathFile is null');
  }
  const filePath = path.join(__dirname, pathFile);
  const write = (strData = '', character = 'utf8') => {
    return new Promise((resovle, reject) => {
      fs.writeFile(filePath, strData, character, function (err, data) {
        if (err) {
          return reject(err);
        }
        return resovle({
          data: data ||'success',
          urlFile: filePath
        });
      });
    });
  };

  const read = () => {
    return new Promise((resovle, reject) => {
      fs.readFile(filePath,'utf8', function (err, data) {
        if (err) {
          return reject(err);
        }
        return resovle(data ||'success');
      })
    })
  };

  const remove = () => {
    return new Promise((resovle, reject) => {
      fs.unlink(filePath, function (err, data) {
        if (err) {
          return reject(err);
        }
        return resovle(data ||'success');
      })
    })
  };

  return {
    filePath,
    write,
    read,
    remove
  }
};

module.exports = files;