import { useEffect, useState } from "react";
import { VideoUploader } from "./components/VideoUploader";
import { httpService } from "./services/http.service";

function App() {
  const [serverStatus, setServerStatus] = useState<string>("Checking...");

  useEffect(() => {
    // Create an async function inside useEffect
    const checkServerHealth = async () => {
      try {
        console.log("Attempting to call /api/alive endpoint...");
        const response = await httpService.get('/alive');
        console.log("Server response:", response);
        setServerStatus("Server is online: " + JSON.stringify(response));
      } catch (error: any) {
        console.error("Error checking server health:", error);
        setServerStatus("Server error: " + error.message);
      }
    };

    // Call the async function
    checkServerHealth();
  }, []);
  
  return (
    <div className="app">
      <div style={{ padding: "10px", marginBottom: "20px", background: "#f5f5f5" }}>
        <strong>API Status:</strong> {serverStatus}
      </div>
      <VideoUploader />
    </div>
  );
}

export default App;
