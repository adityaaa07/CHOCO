/*import React, { useEffect } from 'react';
import { useStateContext } from '../Context/ContextProvider';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import SpotifyPlayer from './SpotifyPlayer';
import YouTubeVideo from './YoutubeVideo';

const stopSpotifyPlayer = () => {
  const spotifyPlayers = document.querySelectorAll('div[id^="spotify-player"]');
  spotifyPlayers.forEach(player => {
    player.remove();
    console.log('QueuePanel: Spotify player stopped and removed.');
  });
};

const stopYouTubePlayer = () => {
  const youtubePlayers = document.querySelectorAll('div[id^="youtube-player"]');
  youtubePlayers.forEach(player => {
    player.remove();
    console.log('QueuePanel: YouTube player stopped and removed.');
  });
};

const QueuePanel = () => {
  const {
    currentPlaying,
    videoIds,
    setCurrentPlaying,
    setVideoIds,
    token,
  } = useStateContext();
  const navigate = useNavigate();
  const roomCode = sessionStorage.getItem('roomCode') || 'default';
  const docRef = doc(db, 'room', roomCode);

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, snapshot => {
      const data = snapshot.data();
      if (data) {
        const newVideoIds = data.currentSong || [];
        const newCurrentPlaying = data.currentPlaying || null;
        console.log('QueuePanel: Firestore update:', { newVideoIds, newCurrentPlaying });
        setVideoIds(newVideoIds);
        setCurrentPlaying(newCurrentPlaying);
      }
    }, err => {
      console.error('QueuePanel: Firestore snapshot error:', err);
    });

    return () => unsubscribe();
  }, [docRef, setVideoIds, setCurrentPlaying]);

  const handlePlayFromQueue = async track => {
    if (!track?.id || !track?.title || !track?.image || !track?.channelName || (track.platform === 'spotify' && !track?.uri)) {
      console.error('QueuePanel: Invalid track data:', track);
      return;
    }

    console.log('QueuePanel: Triggering playback for:', track);

    // Stop all players
    stopYouTubePlayer();
    stopSpotifyPlayer();

    // Update Firebase
    try {
      await updateDoc(docRef, {
        currentPlaying: track,
        isPlaying: true,
        currentTime: 0,
        lastUpdated: Date.now(),
      });

      setCurrentPlaying(track);
      const updatedQueue = Array.isArray(videoIds) ? [...videoIds] : [];
      if (!updatedQueue.some(t => t.id === track.id)) {
        updatedQueue.push(track);
        setVideoIds(updatedQueue);
      }
    } catch (error) {
      console.error('QueuePanel: Error updating Firebase:', error);
      return;
    }

    // Log token status for Spotify tracks
    if (track.platform === 'spotify') {
      const sessionToken = sessionStorage.getItem('spotify_token');
      console.log('QueuePanel: Spotify token status:', { contextToken: token, sessionToken });
      if (!token && !sessionToken) {
        console.warn('QueuePanel: No Spotify token. Playback may fail.');
      }
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
      <div id="player-container" className="mt-4">
        {currentPlaying?.platform === 'youtube' && <YouTubeVideo videoIds={[currentPlaying]} />}
        {currentPlaying?.platform === 'spotify' && (
          <SpotifyPlayer
            token={token || sessionStorage.getItem('spotify_token')}
            uri={currentPlaying.uri}
            image={currentPlaying.image}
            title={currentPlaying.title}
            channelName={currentPlaying.channelName}
          />
        )}
      </div>
    </div>
  );
};

export default QueuePanel; 
------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*
import React from 'react';
import { useStateContext } from '../Context/ContextProvider';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useNavigate } from 'react-router-dom';

const stopSpotifyPlayer = () => {
  const spotifyPlayers = document.querySelectorAll('div[id^="spotify-player"]');
  spotifyPlayers.forEach(player => {
    player.remove();
    console.log("Spotify player stopped and removed.");
  });
};

const stopYouTubePlayer = () => {
  const youtubePlayers = document.querySelectorAll('div[id^="youtube-player"]');
  youtubePlayers.forEach(player => {
    player.remove();
    console.log("YouTube player stopped and removed.");
  });
};

const startSpotifyPlayer = (track, token) => {
  console.log('Starting Spotify playback for:', track.uri);
  const playerElement = document.createElement('div');
  playerElement.id = `spotify-player-${track.id}`;
  const container = document.getElementById('player-container');
  if (container) {
    container.innerHTML = '';
    container.appendChild(playerElement);
  } else {
    console.error('Player container not found');
    return;
  }

  import('react-dom').then(ReactDOM =>
    import('./SpotifyPlayer').then(module => {
      const SpotifyPlayer = module.default;
      ReactDOM.render(
        <SpotifyPlayer
          token={token}
          uri={track.uri}
          image={track.image}
          title={track.title}
          channelName={track.channelName}
        />,
        playerElement
      );
    })
  );
};

const startYouTubePlayer = (id) => {
  console.log('Starting YouTube playback for:', id);
  const playerElement = document.createElement('div');
  playerElement.id = `youtube-player-${id}`;
  const container = document.getElementById('player-container');
  if (container) {
    container.innerHTML = '';
    container.appendChild(playerElement);
  } else {
    console.error('Player container not found');
    return;
  }

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
    setVideoIds,
  } = useStateContext();
  const navigate = useNavigate();

  const handlePlayFromQueue = async (track) => {
    const roomCode = sessionStorage.getItem('roomCode');
    if (!roomCode) {
      console.error('No room code found');
      navigate('/join-room');
      return;
    }

    if (!track.id || !track.title || !track.image || !track.channelName || (track.platform === 'spotify' && !track.uri)) {
      console.error('Invalid track data:', track);
      return;
    }

    // Stop all players
    stopYouTubePlayer();
    stopSpotifyPlayer();

    // Update Firebase
    const roomRef = doc(db, 'room', roomCode);
    try {
      await updateDoc(roomRef, {
        currentPlaying: track,
        isPlaying: true,
        currentTime: 0,
        lastUpdated: Date.now(),
      });

      setCurrentPlaying(track);
      const updatedQueue = Array.isArray(videoIds) ? [...videoIds] : [];
      if (!updatedQueue.some(t => t.id === track.id)) {
        updatedQueue.push(track);
        setVideoIds(updatedQueue);
      }
    } catch (error) {
      console.error('Error updating room data:', error);
      return;
    }

    // Start the new player
    if (track.platform === 'spotify') {
      const token = sessionStorage.getItem('spotify_token');
      if (token && track.uri) {
        startSpotifyPlayer(track, token);
      } else {
        console.error('Spotify token or URI missing');
        navigate('/login');
      }
    } else {
      startYouTubePlayer(track.id);
    }
  };

  return (
    <div className="bg-zinc-900 text-white p-4 rounded-lg overflow-y-auto max-h-64">
      <h3 className="text-lg font-semibold mb-4">Up Next</h3>
      {!videoIds || videoIds.length === 0 ? (
        <p className="text-zinc-400">No songs in queue.</p>
      ) : (
        <ul className="space-y-2">
          {videoIds.map((track) => {
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
---------------------------------------------------------------------------------------------------------------------*/
/*import React, { useEffect, useState } from 'react';
import { useStateContext } from '../Context/ContextProvider';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import SpotifyPlayer from './SpotifyPlayer';
import YouTubeVideo from './YoutubeVideo';

const QueuePanel = () => {
  const { currentPlaying, videoIds, setCurrentPlaying, setVideoIds, token } = useStateContext();
  const navigate = useNavigate();
  const roomCode = sessionStorage.getItem('roomCode') || 'default';
  const docRef = doc(db, 'room', roomCode);

  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, snapshot => {
      const data = snapshot.data();
      if (data) {
        const newVideoIds = data.currentSong || [];
        const newCurrentPlaying = data.currentPlaying || null;
        setVideoIds(newVideoIds);
        setCurrentPlaying(newCurrentPlaying);
      }
    });

    return () => unsubscribe();
  }, [docRef, setVideoIds, setCurrentPlaying]);

  useEffect(() => {
    if (token && !player) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        window.onSpotifyWebPlaybackSDKReady = () => {
          const newPlayer = new window.Spotify.Player({
            name: 'React Spotify Player',
            getOAuthToken: cb => cb(token),
            volume: 0.5,
          });

          newPlayer.addListener('ready', ({ device_id }) => {
            console.log('Player is ready with Device ID', device_id);
          });

          newPlayer.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
          });

          newPlayer.connect();
          setPlayer(newPlayer);
        };
      };
    }
  }, [token, player]);

  const handlePlayFromQueue = async track => {
    if (!track?.id || !track?.title || !track?.image || !track?.channelName || (track.platform === 'spotify' && !track?.uri)) {
      console.error('Invalid track data:', track);
      return;
    }

    try {
      await updateDoc(docRef, {
        currentPlaying: track,
        isPlaying: true,
        currentTime: 0,
        lastUpdated: Date.now(),
      });

      setCurrentPlaying(track);
      const updatedQueue = Array.isArray(videoIds) ? [...videoIds] : [];
      if (!updatedQueue.some(t => t.id === track.id)) {
        updatedQueue.push(track);
        setVideoIds(updatedQueue);
      }

      if (track.platform === 'spotify' && player) {
        player.play({
          uris: [track.uri],
        });
      }
    } catch (error) {
      console.error('Error updating Firestore or playing track:', error);
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
      <div id="player-container" className="mt-4">
        {currentPlaying?.platform === 'youtube' && <YouTubeVideo videoIds={[currentPlaying]} />}
        {currentPlaying?.platform === 'spotify' && (
          <SpotifyPlayer
            token={token}
            uri={currentPlaying.uri}
            image={currentPlaying.image}
            title={currentPlaying.title}
            channelName={currentPlaying.channelName}
          />
        )}
      </div>
    </div>
  );
};

export default QueuePanel;
 ekdum recent-----------------------------------------------------------------------------------------------------*/
import React, { useEffect, useState } from 'react';
import { useStateContext } from '../Context/ContextProvider';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import SpotifyPlayer from './SpotifyPlayer';
import YouTubeVideo from './YoutubeVideo';

const QueuePanel = () => {
  const { currentPlaying, videoIds, setCurrentPlaying, setVideoIds, token } = useStateContext();
  const navigate = useNavigate();
  const roomCode = sessionStorage.getItem('roomCode') || 'default';
  const docRef = doc(db, 'room', roomCode);

  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, snapshot => {
      const data = snapshot.data();
      if (data) {
        const newVideoIds = data.currentSong || [];
        const newCurrentPlaying = data.currentPlaying || null;
        setVideoIds(newVideoIds);
        setCurrentPlaying(newCurrentPlaying);
      }
    });

    return () => unsubscribe();
  }, [docRef, setVideoIds, setCurrentPlaying]);

  useEffect(() => {
    if (token && !player) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        window.onSpotifyWebPlaybackSDKReady = () => {
          const newPlayer = new window.Spotify.Player({
            name: 'React Spotify Player',
            getOAuthToken: cb => cb(token),
            volume: 0.5,
          });

          newPlayer.addListener('ready', ({ device_id }) => {
            console.log('Player is ready with Device ID', device_id);
          });

          newPlayer.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
          });

          newPlayer.connect();
          setPlayer(newPlayer);
        };
      };
    }
  }, [token, player]);

  const handlePlayFromQueue = async track => {
    if (!track?.id || !track?.title || !track?.image || !track?.channelName || (track.platform === 'spotify' && !track?.uri)) {
      console.error('Invalid track data:', track);
      return;
    }

    try {
      await updateDoc(docRef, {
        currentPlaying: track,
        isPlaying: true,
        currentTime: 0,
        lastUpdated: Date.now(),
      });

      setCurrentPlaying(track);
      const updatedQueue = Array.isArray(videoIds) ? [...videoIds] : [];
      if (!updatedQueue.some(t => t.id === track.id)) {
        updatedQueue.push(track);
        setVideoIds(updatedQueue);
      }

      if (track.platform === 'spotify' && player) {
        player.play({
          uris: [track.uri],
        });
      }
    } catch (error) {
      console.error('Error updating Firestore or playing track:', error);
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
                    src={track.image || 'https://via.placeholder.com/150'}  // Default image if none available
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
      <div id="player-container" className="mt-4">
        {currentPlaying?.platform === 'youtube' && <YouTubeVideo videoIds={[currentPlaying]} />}
        {currentPlaying?.platform === 'spotify' && (
          <SpotifyPlayer
            token={token}
            uri={currentPlaying.uri}
            image={currentPlaying.image}
            title={currentPlaying.title}
            channelName={currentPlaying.channelName}
          />
        )}
      </div>
    </div>
  );
};

export default QueuePanel;

/*
import React from 'react';
import { useStateContext } from '../Context/ContextProvider';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

const stopSpotifyPlayer = () => {
  const spotifyPlayers = document.querySelectorAll('div[id^="spotify-player"]');
  spotifyPlayers.forEach(player => {
    player.remove();
    console.log("Spotify player stopped and removed.");
  });
};

const stopYouTubePlayer = () => {
  const youtubePlayers = document.querySelectorAll('div[id^="youtube-player"]');
  youtubePlayers.forEach(player => {
    player.remove();
    console.log("YouTube player stopped and removed.");
  });
};

const startSpotifyPlayer = (uri, token) => {
  console.log('Starting Spotify playback for:', uri);
  const playerElement = document.createElement('div');
  playerElement.id = `spotify-player-${uri.split(':').pop()}`;
  document.body.appendChild(playerElement);

  import('react-dom').then(ReactDOM =>
    import('./SpotifyPlayer').then(module => {
      const SpotifyPlayer = module.default;
      ReactDOM.render(<SpotifyPlayer token={token} uri={uri} />, playerElement);
    })
  );
};

const startYouTubePlayer = (id) => {
  console.log('Starting YouTube playback for:', id);
  const playerElement = document.createElement('div');
  playerElement.id = `youtube-player-${id}`;
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
    setVideoIds,
  } = useStateContext();

  const handlePlayFromQueue = async (track) => {
    const roomCode = sessionStorage.getItem('roomCode');
    if (!roomCode) return;

    // Update Firebase
    const roomRef = doc(db, 'room', roomCode);
    try {
      await updateDoc(roomRef, {
        currentPlaying: track,
        isPlaying: true,
        currentTime: 0,
        lastUpdated: Date.now(),
      });

      // Update context
      setCurrentPlaying(track);
      const updatedQueue = Array.isArray(videoIds) ? [...videoIds] : [];
      if (!updatedQueue.some(t => t.id === track.id)) {
        updatedQueue.push(track);
        setVideoIds(updatedQueue);
      }
    } catch (error) {
      console.error('Error updating room data:', error);
      return;
    }

    // Stop the other player and start the new one
    if (track.platform === 'spotify') {
      stopYouTubePlayer();
      const token = sessionStorage.getItem('spotify_token');
      if (token && track.uri) {
        startSpotifyPlayer(track.uri, token);
      }
    } else {
      stopSpotifyPlayer();
      startYouTubePlayer(track.id);
    }
  };

  return (
    <div className="bg-zinc-900 text-white p-4 rounded-lg overflow-y-auto max-h-64">
      <h3 className="text-lg font-semibold mb-4">Up Next</h3>
      {!videoIds || videoIds.length === 0 ? (
        <p className="text-zinc-400">No songs in queue.</p>
      ) : (
        <ul className="space-y-2">
          {videoIds.map((track) => {
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
*/
