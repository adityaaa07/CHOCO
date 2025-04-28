import React from "react";
import { useRoom } from "../Context/RoomContext";

const QueuePanel = () => {
  const { queue } = useRoom();

  return (
    <div className="p-4">
      <h2 className="text-white text-xl font-bold mb-4">Queue</h2>
      {queue.length === 0 ? (
        <p className="text-gray-400">No songs in queue</p>
      ) : (
        <ul className="space-y-4">
          {queue.map((track, index) => (
            <li key={track.id} className="flex items-center bg-gray-800 rounded-lg p-3 shadow-md">
              {/* Platform Icon */}
              <div className="mr-4">
                {track.platform === "spotify" ? (
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
                    alt="Spotify"
                    className="h-8 w-8"
                  />
                ) : (
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg"
                    alt="YouTube"
                    className="h-8 w-8"
                  />
                )}
              </div>

              {/* Song Info */}
              <div className="flex flex-col">
                <span className="text-white font-semibold">{track.title}</span>
                <span className="text-gray-400 text-sm">{track.artist}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QueuePanel;

/*import React from 'react';
import { useStateContext } from '../Context/ContextProvider';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

const QueuePanel = () => {
  const {
    currentPlaying,
    videoIds,
    setCurrentPlaying,
  } = useStateContext();

  const handlePlayFromQueue = async (track) => {
    const roomCode = sessionStorage.getItem('roomCode');
    await updateDoc(doc(db, 'room', roomCode), {
      currentPlaying: track,
    });
  };

  return (
    <div className="bg-zinc-900 text-white p-4 rounded-lg h-full overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Up Next</h3>
      {!videoIds || videoIds.length === 0 ? (
        <p>No songs in queue.</p>
      ) : (
        <ul className="space-y-2">
          {videoIds.map((track, index) => {
            const isCurrent = currentPlaying?.id === track.id;

            return (
              <li
                key={track.id}
                onClick={() => handlePlayFromQueue(track)}
                className={`p-2 rounded-md cursor-pointer hover:bg-zinc-800 transition-all duration-200 ${
                  isCurrent ? 'bg-indigo-700 bg-opacity-30 border border-indigo-500' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                <span className="text-sm opacity-60">{track.platform === 'spotify' ? '🎵' : '▶️'}</span>
                  <img
                    src={track.image}
                    alt={track.title}
                    className="w-10 h-10 rounded-md"
                  />
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${isCurrent ? 'text-indigo-300' : ''}`}>
                      {track.title}
                    </span>
                    <span className="text-xs text-zinc-400">{track.channelName}</span>
                    {track.playedBy && (
                      <span className="text-xs text-zinc-500 italic">Added by {track.playedBy}</span>
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
*/
