const cloudinary = require("cloudinary").v2;

const uploadImage = async (file) => {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Upload an image
  await cloudinary.uploader
    .upload(file, {
      folder: "user",
      public_id: "profile_image",
    })
    .catch((error) => {
      console.log(error);
    });

  // Optimize delivery by resizing and applying auto-format and auto-quality
  const optimizeUrl = cloudinary.url("profile_image", {
    fetch_format: "auto",
    quality: "auto",
  });

  //   console.log(optimizeUrl);

  //   // Transform the image: auto-crop to square aspect_ratio
  //   const autoCropUrl = cloudinary.url("profile_image", {
  //     crop: "auto",
  //     gravity: "auto",
  //     width: 500,
  //     height: 500,
  //   });

  //   console.log(autoCropUrl);

  return optimizeUrl;
};

module.exports = uploadImage;
