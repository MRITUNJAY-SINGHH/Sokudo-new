import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload buffer file
export const uploadFilesToCloudinary = async (files, folder = "") => {
  const urls = [];

  for (const file of files) {
    if (file.buffer) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
          { folder },
          (err, res) => {
            if (err) reject(err);
            else resolve(res);
          }
        ).end(file.buffer);
      });

      urls.push(result.secure_url);
    }
  }

  return urls;
};

// Delete files
export const deleteFilesFromCloudinary = async (urls) => {
  for (const url of urls) {
    const publicId = url.split("/").pop().split(".")[0];
    await cloudinary.v2.uploader.destroy(publicId);
  }
};
