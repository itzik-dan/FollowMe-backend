const express = require('express')
const router = express.Router()
const cloudinary = require("cloudinary");

// config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// route for uploading image for post
router.post('/upload', async (req, res) => {
  try {
    // Fetching photo string from cloudinary
    const fileString = req.body.data
    // calling the upload function of cloudinary
    const result = await cloudinary.v2.uploader.upload(fileString, {
      folder: "follow-me"
    });
    console.log({
      result
    })
    res.json({
      public_id: result.public_id,
      url: result.secure_url,
    });
  } catch(e) {
    // statements
    console.log(e);
    res.status(500).json({err: 'something went wrong'})
  }
})

module.exports = router
