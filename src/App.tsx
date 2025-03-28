import { useEffect, useState } from "react";
import { httpService } from "./services/http.service";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    httpService.get<{ status: string; message: string }>("/alive")
      .then((res) => {
        console.log("API Response:", res);
        setMessage(res.message);
      })
      .catch((err) => {
        console.error("Error fetching /alive:", err);
      });
  }, []);

  return (
    <div className="App">
      <h1>Video Gallery</h1>
      <p>{message || "Loading..."}</p>
    </div>
  );
}

export default App;
