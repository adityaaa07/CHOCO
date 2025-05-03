import React from 'react';
import { useStateContext } from '../Context/ContextProvider';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

// Stop the Spotify player if it's playing
const stopSpotifyPlayer = () => {
  const spotifyPlayer = document.querySelector('div[id^="spotify-player"]');
  if (spotifyPlayer) {
    spotifyPlayer.remove(); // Remove the Spotify player element
    console.log("Spotify player stopped and removed.");
  }
};

// Stop the YouTube player if it's playing
const stopYouTubePlayer = () => {
  const youtubePlayer = document.querySelector('div[id^="youtube-player"]');
  if (youtubePlayer) {
    youtubePlayer.remove(); // Remove the YouTube player element
    console.log("YouTube player stopped and removed.");
  }
};

// Start Spotify playback (this is a placeholder, modify as per your Spotify player setup)
const startSpotifyPlayer = (uri) => {
  console.log('Starting Spotify playback for:', uri);
  // Assuming you have a SpotifyPlayer component to manage playback
  const playerElement = document.createElement('div');
  document.body.appendChild(playerElement);

  import('react-dom').then(ReactDOM =>
    import('./SpotifyPlayer').then(module => {
      const SpotifyPlayer = module.default;
      ReactDOM.render(<SpotifyPlayer token={sessionStorage.getItem('spotify_token')} uri={uri} />, playerElement);
    })
  );
};

// Start YouTube playback (this is a placeholder, modify as per your YouTube player setup)
const startYouTubePlayer = (id) => {
  console.log('Starting YouTube playback for:', id);
  // Assuming you have a YouTubeVideo component to manage playback
  const playerElement = document.createElement('div');
  document.body.appendChild(playerElement);

  import('react-dom').then(ReactDOM =>
    import('./YoutubeVideo').then(module => {
      const YouTubeVideo = module.default;
      ReactDOM.render(<YouTubeVideo videoIds={[{ id }]} />, playerElement);
    })
  );
};

const QueuePanel = () => {
  const {
    currentPlaying,
    videoIds,
    setCurrentPlaying,
  } = useStateContext();

  const handlePlayFromQueue = async (track) => {
    const roomCode = sessionStorage.getItem('roomCode');
    if (!roomCode) return;

    // Update Firebase with the new current playing track
    await updateDoc(doc(db, 'room', roomCode), {
      currentPlaying: track,  // Set the current playing track
      isPlaying: true,  // Ensure playback starts
      currentTime: 0,  // Reset current time
      lastUpdated: Date.now(),  // Update timestamp in Firebase
    }).catch((error) => {
      console.error('Error updating room data:', error);
    });

    // Stop the other player based on the platform of the track being played
    if (track.platform === 'spotify') {
      stopYouTubePlayer();  // Stop YouTube if Spotify is selected
      startSpotifyPlayer(track.uri);  // Start Spotify playback
    } else {
      stopSpotifyPlayer();  // Stop Spotify if YouTube is selected
      startYouTubePlayer(track.id);  // Start YouTube playback
    }

    // Update the UI to reflect the current track being played
    setCurrentPlaying(track);
  };

  return (
    <div className="bg-zinc-900 text-white p-4 rounded-lg overflow-y-auto max-h-64">
      <h3 className="text-lg font-semibold mb-4">Up Next</h3>
      {!videoIds || videoIds.length === 0 ? (
        <p className="text-zinc-400">No songs in queue.</p>
      ) : (
        <ul className="space-y-2">
          {videoIds.map((track) => {
            const isCurrent = currentPlaying?.id === track.id;  // Check if this track is the currently playing one
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
