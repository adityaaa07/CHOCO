import React, { useEffect, useRef, useState } from 'react';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase-config'; // adjust path as needed

const MediaPlayer = ({ roomCode, currentSongUrl }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 🔁 Firestore listener
  useEffect(() => {
    if (!roomCode) return;

    const unsub = onSnapshot(doc(db, 'room', roomCode), (docSnap) => {
      const data = docSnap.data();
      if (!data?.playbackState || !audioRef.current) return;

      const { action, time } = data.playbackState;

      if (action === 'play') {
        audioRef.current.currentTime = time;
        audioRef.current.play();
        setIsPlaying(true);
      } else if (action === 'pause') {
        audioRef.current.pause();
        setIsPlaying(false);
      } else if (action === 'seek') {
        audioRef.current.currentTime = time;
      }
    });

    return () => unsub();
  }, [roomCode]);

  // 🔁 Emit actions to Firestore
  const updatePlayback = async (action, timeOverride = null) => {
    if (!roomCode || !audioRef.current) return;

    await updateDoc(doc(db, 'room', roomCode), {
      playbackState: {
        action,
        time: timeOverride ?? audioRef.current.currentTime,
        updatedAt: serverTimestamp(),
      }
    });
  };

  const handlePlay = () => updatePlayback('play');
  const handlePause = () => updatePlayback('pause');
  const handleSeek = (e) => updatePlayback('seek', e.target.currentTime);

  // 📡 Set song when it changes
  useEffect(() => {
    if (audioRef.current && currentSongUrl) {
      audioRef.current.src = currentSongUrl;
      audioRef.current.load();
      setIsPlaying(false);
    }
  }, [currentSongUrl]);

  return (
    <div className="media-player">
      <audio
        ref={audioRef}
        onPlay={handlePlay}
        onPause={handlePause}
        onSeeked={handleSeek}
        controls
      />
    </div>
  );
};

export default MediaPlayer;
