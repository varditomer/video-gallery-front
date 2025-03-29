import React, { useState, useRef } from "react";
import { uploadService } from "../services/upload.service";

interface UploadStatus {
  fileName: string;
  progress: number;
  status: "uploading" | "success" | "error";
  url?: string;
  error?: string;
}

export const VideoUploader: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!fileInputRef.current?.files?.length) {
      alert("Please select at least one video file");
      return;
    }

    const files = Array.from(fileInputRef.current.files);
    setIsUploading(true);

    // Initialize upload status for each file
    const initialStatuses = files.map((file) => ({
      fileName: file.name,
      progress: 0,
      status: "uploading" as const,
    }));
    setUploadStatuses(initialStatuses);

    // Upload each file
    const uploadPromises = files.map(async (file, index) => {
      try {
        const response = await uploadService.uploadVideo(
          file.name,
          file,
          (progress) => {
            console.log(
              `Progress update in component for ${file.name}: ${progress}%`
            ); // Debug log

            // Update progress for this specific file
            setUploadStatuses((prevStatuses) => {
              const newStatuses = [...prevStatuses];
              newStatuses[index] = {
                ...newStatuses[index],
                progress,
              };
              return newStatuses;
            });
          }
        );

        // Update status to success
        setUploadStatuses((prevStatuses) => {
          const newStatuses = [...prevStatuses];
          newStatuses[index] = {
            ...newStatuses[index],
            status: "success",
            url: response.url,
          };
          return newStatuses;
        });

        return response;
      } catch (error: any) {
        // Update status to error
        setUploadStatuses((prevStatuses) => {
          const newStatuses = [...prevStatuses];
          newStatuses[index] = {
            ...newStatuses[index],
            status: "error",
            error: error.message,
          };
          return newStatuses;
        });
        throw error;
      }
    });

    try {
      // Wait for all uploads to complete or fail
      await Promise.allSettled(uploadPromises);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload Videos</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="video">Select video files:</label>
          <input
            type="file"
            id="video"
            ref={fileInputRef}
            accept="video/*"
            multiple
            required
            disabled={isUploading}
          />
        </div>

        <button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload Videos"}
        </button>
      </form>

      {uploadStatuses.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Upload Progress</h3>
          {uploadStatuses.map((status, index) => (
            <div
              key={index}
              style={{
                marginBottom: "10px",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "4px",
              }}
            >
              <div>{status.fileName}</div>
              <div style={{ margin: "5px 0" }}>
                <div
                  style={{
                    height: "20px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${status.progress}%`,
                      backgroundColor:
                        status.status === "error"
                          ? "red"
                          : status.status === "success"
                          ? "green"
                          : "blue",
                      transition: "width 0.3s",
                    }}
                  />
                </div>
              </div>
              <div>
                {status.status === "uploading" &&
                  `Uploading: ${status.progress}%`}
                {status.status === "success" && (
                  <span>
                    Upload complete!
                    <a
                      href={status.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ marginLeft: "10px" }}
                    >
                      View video
                    </a>
                  </span>
                )}
                {status.status === "error" && `Error: ${status.error}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
