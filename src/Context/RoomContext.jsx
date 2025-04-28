import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    const roomCode = sessionStorage.getItem('roomCode');
    if (!roomCode) return;

    const queueRef = collection(db, 'room', roomCode, 'queue');
    const q = query(queueRef, orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const queueData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQueue(queueData);
    });

    return () => unsubscribe();
  }, [sessionStorage.getItem('roomCode')]);

  const addToQueue = async (songData, platform) => {
    const roomCode = sessionStorage.getItem('roomCode');
    if (!roomCode) return;

    const queueRef = collection(db, 'room', roomCode, 'queue');
    await addDoc(queueRef, {
      title: songData.title || '',
      artist: songData.artist || '',
      uri: songData.uri || '',
      platform: platform || 'youtube',
      timestamp: serverTimestamp(),
      addedBy: songData.addedBy || '',
    });
  };

  const value = {
    queue,
    addToQueue,
    currentTrack,
    setCurrentTrack,
  };

  return (
    <RoomContext.Provider value={value}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => useContext(RoomContext);
