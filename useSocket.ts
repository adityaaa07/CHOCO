import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Connected to server", newSocket.id);
      setConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  //  ADDED: Move joinSpeaker function outside useEffect and RETURN IT
  const joinSpeaker = (speakerId: string) => {
    if (socket) {
      socket.emit("joinSpeaker", speakerId);
    }
  };

  return { socket, connected, joinSpeaker }; //  Fix: Now `joinSpeaker` is used
};
