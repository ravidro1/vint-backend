const cloudinary = require("cloudinary").v2;
const fs = require("fs");
// const sharp = require("sharp");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//////////////// (image)
exports.cloudinaryUploadImage = async (image) => {
  try {
    // console.log(image.buffer.toString("base64"), 5432532);

    const dataURL =
      `data:${image.mimetype};base64,` + image.buffer.toString("base64");

    if (!image) return res.status(404).json({message: "image not found"});

    const pic = cloudinary.uploader.upload(dataURL);

    const url = await pic
      .then((data) => {
        return data.secure_url;
      })
      .catch((err) => {
        console.log(err);
      });

    // res.status(200).json({message: url});
    console.log(url);
    return url;
  } catch (err) {
    console.log({message: "Error - cloudinaryUploadImage", err});
  }
};

exports.cloudinaryUploadVideo = async (video) => {};
