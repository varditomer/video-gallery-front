import { upload as blobUpload } from "@vercel/blob/client";

interface UploadResponse {
  url: string;
  pathname: string;
}

type ProgressCallback = (progress: number) => void;

// Upload video using Vercel Blob client
// In upload.service.ts
const uploadVideo = async (
  fileName: string,
  file: File,
  onProgress?: ProgressCallback
): Promise<UploadResponse> => {
  try {
    const handleUploadUrl =
      process.env.NODE_ENV === "production"
        ? "/api/upload/index" // In production, use relative URL
        : "http://localhost:3000/api/upload"; // In development, use absolute URL

    // Create options object with the correct callback name
    const options: any = {
      access: "public",
      handleUploadUrl: handleUploadUrl,
      // Use the correct property name from the docs
      onUploadProgress: onProgress
        ? (e: { percentage: number }) => {
            console.log(`Upload progress for ${fileName}: ${e.percentage}%`);
            onProgress(e.percentage);
          }
        : undefined,
    };

    // Now use the full URL with the blob upload function
    const blob = await blobUpload(fileName, file, options);

    return blob;
  } catch (error: any) {
    console.error("Unable to upload file: ", error);
    throw error;
  }
};

export const uploadService = {
  uploadVideo,
};
