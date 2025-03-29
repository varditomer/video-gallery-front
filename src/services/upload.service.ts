import { upload as blobUpload } from "@vercel/blob/client";

interface UploadResponse {
  url: string;
  pathname: string;
}

// Upload video using Vercel Blob client
const uploadVideo = async (
  fileName: string,
  file: File
): Promise<UploadResponse> => {
  try {
    const handleUploadUrl =
      process.env.NODE_ENV === "production"
        ? "/api/upload/index" // In production, use relative URL
        : "http://localhost:3000/api/upload"; // In development, use absolute URL

    // Now use the full URL with the blob upload function
    const blob = await blobUpload(fileName, file, {
      access: "public",
      handleUploadUrl: handleUploadUrl,
    });

    return blob;
  } catch (error: any) {
    console.error("Unable to upload file: ", error);
    throw error;
  }
};

export const uploadService = {
  uploadVideo,
};
