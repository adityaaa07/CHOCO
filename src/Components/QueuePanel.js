// src/components/QueuePanel.js
import React, { useEffect } from 'react';
import { useStateContext } from '../Context/ContextProvider';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

const QueuePanel = () => {
  const {
    currentPlaying, videoIds, setCurrentPlaying,
    setVideoIds, setCurrentTrack
  } = useStateContext();

  const roomCode = sessionStorage.getItem('roomCode') || 'default';
  const docRef = doc(db, 'room', roomCode);

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, snapshot => {
      const data = snapshot.data();
      if (data) {
        setVideoIds(data.currentSong || []);
        setCurrentPlaying(data.currentPlaying || null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePlayFromQueue = async (track) => {
    try {
      await updateDoc(docRef, {
        currentPlaying: track,
        isPlaying: true,
        currentTime: 0,
        lastUpdated: Date.now(),
      });

      setCurrentPlaying(track);
      setCurrentTrack({
        type: track.platform,
        videoId: track.videoId,
        uri: track.uri,
      });
    } catch (err) {
      console.error('Error updating Firestore for track playback:', err);
    }
  };

  return (
    <div className="bg-zinc-900 text-white p-4 rounded-lg overflow-y-auto max-h-64">
      <h3 className="text-lg font-semibold mb-4">Up Next</h3>
      {!videoIds || videoIds.length === 0 ? (
        <p className="text-zinc-400">No songs in queue.</p>
      ) : (
        <ul className="space-y-2">
          {videoIds.map(track => {
            const isCurrent = currentPlaying?.id === track.id;
            return (
              <li
                key={track.id}
                onClick={() => handlePlayFromQueue(track)}
                className={`p-2 rounded-md cursor-pointer hover:bg-zinc-800 transition-all duration-200 ${isCurrent ? 'bg-indigo-700 bg-opacity-30 border border-indigo-500' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm opacity-60">
                    {track.platform === 'spotify' ? '🎵' : '▶️'}
                  </span>
                  <img
                    src={track.image}
                    alt={track.title}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${isCurrent ? 'text-indigo-300' : ''}`}>
                      {track.title}
                    </span>
                    <span className="text-xs text-zinc-400">{track.channelName}</span>
                    {track.playedBy && (
                      <span className="text-xs text-zinc-500 italic">
                        Added by {track.playedBy}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default QueuePanel;
