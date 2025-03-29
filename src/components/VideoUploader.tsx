import React, { useState, useRef } from "react";
import { uploadService } from "../services/upload.service";

export const VideoUploader: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!fileInputRef.current?.files?.length) {
      alert("Please select a video file");
      return;
    }
    
    const file = fileInputRef.current.files[0];
    setIsUploading(true);
    
    try {
      const response = await uploadService.uploadVideo(file.name, file);
      console.log("Upload successful:", response);
      setUploadedUrl(response.url);
    } catch (error) {
      console.error("Full error:", error);
      alert(`Upload failed: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div>
      <h2>Upload Video</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="video">Select video file:</label>
          <input 
            type="file" 
            id="video" 
            ref={fileInputRef}
            accept="video/*" 
            required
            disabled={isUploading} 
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>
      
      {uploadedUrl && (
        <div>
          <p>Video uploaded successfully!</p>
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
            View Uploaded Video
          </a>
        </div>
      )}
    </div>
  );
};
