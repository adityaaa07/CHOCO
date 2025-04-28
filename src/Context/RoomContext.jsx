// src/Context/RoomContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase-config";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [roomCode, setRoomCode] = useState(null);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    if (!roomCode) return;

    const q = query(
      collection(db, "rooms", roomCode, "queue"),
      orderBy("addedAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const queueData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQueue(queueData);
    });

    return () => unsubscribe();
  }, [roomCode]);

  const addToQueue = async (songData, platform) => {
    if (!roomCode) return;

    const songPayload = {
      ...songData,
      platform: platform, // 'youtube' or 'spotify'
      addedAt: new Date(),
    };

    await addDoc(collection(db, "rooms", roomCode, "queue"), songPayload);
  };

  return (
    <RoomContext.Provider
      value={{
        roomCode,
        setRoomCode,
        queue,
        addToQueue,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => useContext(RoomContext);
