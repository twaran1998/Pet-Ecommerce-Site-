
//Function to verify file uploaded and only accept jpg jpeg png or webp
exports.verifyFileFormat = function (file) {

  
      const fileType = file.type;
      if(fileType !== 'image/jpeg' && fileType !== 'image/jpg' && fileType !== 'image/png' && fileType !== 'image/webp' && fileType !== 'image/avif')
      {
        return false;
      }
      else
      {
        return true;
      }
}

