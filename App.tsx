import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useSocket } from "./hooks/useSocket";
import QRCodeComponent from "./components/QRCodeComponent";
import JoinSpeaker from "./pages/JoinSpeaker";

const App: React.FC = () => {
  const { socket, connected } = useSocket();
  const [speakerId] = useState("12345");

  return (
    <Routes>
      {/* Home Page - Shows QR Code */}
      <Route
        path="/"
        element={
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>🎵 Choco Web Interface 🎵</h1>
            <h2>Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}</h2>
            {connected && <QRCodeComponent speakerId={speakerId} />}
          </div>
        }
      />

      {/* Join Speaker Page */}
      <Route path="/join/:speakerId" element={<JoinSpeaker />} />
    </Routes>
  );
};

export default App;
