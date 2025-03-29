import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";

const JoinSpeaker: React.FC = () => {
  const { speakerId } = useParams(); // Get speaker ID from the URL
  const { connected, joinSpeaker } = useSocket();

   // ADDED: Join speaker session on component mount
  useEffect(() => {
    if (speakerId) {
      joinSpeaker(speakerId);
    }
  }, [speakerId, joinSpeaker]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Join Speaker Session</h1>
      <h2>Speaker ID: {speakerId}</h2>
      <p>Status: {connected ? "Connected" : "Disconnected"}</p>
      <button
        onClick={() => joinSpeaker(speakerId!)}
        style={{
          padding: "10px 20px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        Connect to Speaker
      </button>
    </div>
  );
};

export default JoinSpeaker;
