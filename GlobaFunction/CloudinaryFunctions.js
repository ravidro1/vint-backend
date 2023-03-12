const cloudinary = require("cloudinary").v2;
const fs = require("fs");
// const sharp = require("sharp");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//////////////// (image) //////////////////////////
exports.cloudinaryUploadImage = async (image) => {
  try {
    if (!image) return res.status(404).json({message: "image not found"});
    if (image.size > 10485760)
      return res.status(404).json({message: "The image is too large"});

    const dataURL =
      `data:${image.mimetype};base64,` + image.buffer.toString("base64");

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
    console.log({message: "Error - cloudinaryUploadFile", err});
  }
};

////// (video) ///////////////////////
exports.cloudinaryUploadVideo = async (video) => {
  try {
    // const video = req.file;
    if (!video) return res.status(404).json({message: "video not found"});
    if (video.size > 10485760)
      return res.status(404).json({message: "The video is too large"});

    const dataURL =
      `data:${video.mimetype};base64,` + video.buffer.toString("base64");

    const pic = cloudinary.uploader.upload(dataURL, {resource_type: "video"});

    const url = await pic
      .then((data) => {
        return data.secure_url;
      })
      .catch((err) => {
        console.log(err);
      });

    res.status(200).json({message: url});
    console.log(url);
    return url;
  } catch (err) {
    console.log({message: "Error - cloudinaryUploadFile", err});
  }
};
