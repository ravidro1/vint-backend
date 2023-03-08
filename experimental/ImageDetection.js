const express = require("express");
const router = express.Router();
const upload = require("./uploadMiddlewire");
const TeachableMachine = require("@sashido/teachablemachine-node");
const {createCanvas, loadImage} = require("canvas");
const sharp = require("sharp");

const MAX_WIDTH = 4096;
const MAX_HEIGHT = 4096;
const MIME_TYPE = "image/jpeg";
const QUALITY = 3;

const compressImage = async (file) => {
  try {
    const imgPngFormat = await sharp(file.buffer).toFormat("png").toBuffer();

    const img = await loadImage(imgPngFormat);
    const [newWidth, newHeight] = calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
    const canvas = createCanvas(newWidth, newHeight);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
    const buffer = canvas.toBuffer(MIME_TYPE, QUALITY);
    console.log("file compress");
    return buffer;
  } catch (error) {
    console.log("Error - compressImage");
    console.log(error);
  }
};

const model = new TeachableMachine({
  modelUrl: process.env.IMAGE_DETECTION,
});

const imageDetection = async (req, res) => {
  if (!req.file) {
    res.status(401).json({error: "Please provide an image"});
  }

  console.log("Got the file");

  const compressBuffer = await compressImage(req.file);

  const compressedImageDataUrl =
    `data:${MIME_TYPE};base64,` + compressBuffer.toString("base64");

  return model
    .classify({
      imageUrl: compressedImageDataUrl,
    })
    .then((predictions) => {
      res.json(predictions);
      console.log(predictions);
    })
    .catch((e) => {
      res.status(500).send("Something went wrong!");
    });
};

module.exports = router;
