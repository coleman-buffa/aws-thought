const { v4: uuidv4 } = require('uuid');

const params = fileName => {
  const myFile = fileName.originalname.split('.');
  const fileType = myFile[myFile.length - 1];

  const imageParams = {
    Bucket: 'user-images-a1fc261d-d697-4c76-ae5c-ac691301359f',
    Key: `${uuidv4()}.${fileType}`,
    Body: fileName.buffer
  };

  return imageParams;
};

module.exports = params;