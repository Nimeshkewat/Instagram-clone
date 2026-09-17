import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

export const uploadBufferToCloudinary = (
  buffer: Buffer,
  folder = "general",
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    if (!buffer) {
      return reject(new Error("No file buffer found on the request object."));
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Cloduinary upload failed with no result."));
        }

        resolve(result);
      },
    );

    stream.end(buffer);
  });
};
