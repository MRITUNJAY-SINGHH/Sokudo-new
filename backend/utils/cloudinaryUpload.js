import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadFilesToCloudinary = async (files, folder) => {
  const urls = [];
  for (const file of files) {
    const result = await cloudinary.uploader.upload(file.path, { folder });
    urls.push(result.secure_url);
    // fs.unlinkSync(file.path); // remove temp file
  }
  return urls;
};


export const deleteFilesFromCloudinary = async (urls, folder) => {
  for (const url of urls) {
    const parts = url.split("/");
    const publicIdWithExt = parts[parts.length - 1];
    const publicId = publicIdWithExt.split(".")[0];
    await cloudinary.uploader.destroy(`${folder}/${publicId}`);
  }
};
