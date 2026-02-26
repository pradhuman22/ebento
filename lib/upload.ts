"use server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImageToCloudinaryAction(
  folderName: string,
  formData: FormData
) {
  const file = formData.get("file") as File;
  if (!file) return { error: "No file uploaded" };
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: folderName }, (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url);
      })
      .end(buffer);
  });
}

export async function deleteImageFromCloudinaryAction(url: string) {
  const parts = url.split("/");
  const uploadIndex = parts.indexOf("upload");
  if (uploadIndex === -1) {
    return null;
  }
  let startIndex = uploadIndex + 1;
  if (parts[startIndex] && parts[startIndex].startsWith("v")) {
    startIndex++;
  }
  const publicIdParts = parts.slice(startIndex);
  const lastPart = publicIdParts[publicIdParts.length - 1];
  const dotIndex = lastPart.lastIndexOf(".");
  if (dotIndex !== -1) {
    publicIdParts[publicIdParts.length - 1] = lastPart.substring(0, dotIndex);
  }
  const publicId = publicIdParts.join("/");
  try {
    const data = await cloudinary.uploader.destroy(publicId);
    if (data.result == "ok") {
      return { success: true, message: "Deleted Successfully" };
    } else {
      return { success: false, message: "Failed to delete image" };
    }
  } catch (error) {
    console.error("Failed to delete image from Cloudinary:", error);
    return { success: false, error: "Failed to delete image." };
  }
}
