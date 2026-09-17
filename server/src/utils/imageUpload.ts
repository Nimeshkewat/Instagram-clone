import {
  v2 as cloudinary,
  type UploadApiResponse,
  type TransformationOptions,
} from "cloudinary";

interface UploadOptions {
  folder?: string;
  type: "avatar" | "post" | "general";
}

export const uploadBufferToCloudinary = (
  buffer: Buffer,
  options: UploadOptions = { type: "general" },
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    if (!buffer) {
      return reject(new Error("No file buffer found on the request object."));
    }

    // transformation rule based on the type of upload
    let transformation: TransformationOptions[] = [
      { quality: "auto" },
      { fetch_format: "auto" },
    ];
    if (options.type === "avatar") {
      transformation.unshift({
        width: 300,
        height: 300,
        crop: "fill",
        gravity: "face",
      });
    } else if (options.type === "post") {
      transformation.unshift({
        width: 1080,
        crop: "limit",
      });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: options.folder || "general", transformation },
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
