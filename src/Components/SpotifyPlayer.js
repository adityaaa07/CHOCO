/*import React, { useEffect, useState } from 'react';
import { useStateContext } from '../Context/ContextProvider';
import { HiPlay, HiPause } from 'react-icons/hi2';
import axios from 'axios';

const SpotifyPlayer = ({ uri, image, title, channelName }) => {
  const { token, setToken } = useStateContext();
  const [player, setPlayer] = useState(null); // Spotify Player instance
  const [isPlaying, setIsPlaying] = useState(false); // Play/pause state
  const [error, setError] = useState(null); // Error message
  const [deviceId, setDeviceId] = useState(null); // Spotify device ID
  const playerId = `spotify-player-${uri ? uri.split(':').pop() : 'default'}`; // Unique player ID

  const refreshToken = async () => {
    const refresh_token = sessionStorage.getItem('spotify_refresh_token');
    if (!refresh_token) {
      setError('No refresh token available. Please log in again.');
      return null;
    }
    try {
      console.log('SpotifyPlayer: Refreshing token');
      const response = await axios.post('https://choco-flax.vercel.app/api/spotify/token', {
        refresh_token,
      });
      const { access_token, expires_in } = response.data;
      sessionStorage.setItem('spotify_token', access_token);
      sessionStorage.setItem('spotify_token_expiry', Date.now() + expires_in * 1000);
      setToken(access_token);
      console.log('SpotifyPlayer: Token refreshed:', access_token);
      return access_token;
    } catch (err) {
      console.error('SpotifyPlayer: Token refresh error:', err.response?.data || err.message);
      setError('Failed to refresh Spotify token. Please log in again.');
      return null;
    }
  };

  useEffect(() => {
    let sessionToken = sessionStorage.getItem('spotify_token');
    const expiry = sessionStorage.getItem('spotify_token_expiry');
    const isExpired = expiry && Date.now() >= parseInt(expiry);
    console.log('SpotifyPlayer: Token status:', { sessionToken, isExpired, uri, title });

    if (isExpired) {
      console.log('SpotifyPlayer: Token expired, refreshing');
      refreshToken().then(newToken => {
        sessionToken = newToken;
      });
    }

    const activeToken = token || sessionToken;
    if (!activeToken || !uri) {
      console.warn('SpotifyPlayer: Missing token or URI:', { activeToken, uri });
      setError('Cannot play track: Please log in or select a valid track.');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log('SpotifyPlayer: Spotify SDK Ready');
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Choco Web Player',
        getOAuthToken: cb => cb(activeToken),
        volume: 0.5,
      });

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('SpotifyPlayer: Player ready, device_id:', device_id);
        setPlayer(spotifyPlayer);
        setDeviceId(device_id);
      });

      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.warn('SpotifyPlayer: Device offline:', device_id);
        setError('Spotify player is offline. Please check your connection.');
        setDeviceId(null);
      });

      spotifyPlayer.addListener('player_state_changed', state => {
        if (state) {
          setIsPlaying(!state.paused);
          console.log('SpotifyPlayer: State changed:', state);
        }
      });

      spotifyPlayer.addListener('initialization_error', ({ message }) => {
        console.error('SpotifyPlayer: Initialization error:', message);
        setError('Failed to initialize Spotify player.');
      });

      spotifyPlayer.addListener('authentication_error', ({ message }) => {
        console.error('SpotifyPlayer: Authentication error:', message);
        setError('Spotify authentication failed. Please log in again.');
      });

      spotifyPlayer.addListener('account_error', ({ message }) => {
        console.error('SpotifyPlayer: Account error:', message);
        setError('Spotify account issue: ' + message);
      });

      spotifyPlayer.addListener('playback_error', ({ message }) => {
        console.error('SpotifyPlayer: Playback error:', message);
        setError('Playback error: ' + message);
      });

      spotifyPlayer.connect().then(success => {
        console.log('SpotifyPlayer: Connect status:', success);
        if (!success) {
          setError('Failed to connect to Spotify.');
        }
      });
    };

    return () => {
      if (player) {
        player.disconnect();
      }
      document.body.removeChild(script);
      const existingPlayer = document.getElementById(playerId);
      if (existingPlayer) {
        existingPlayer.remove();
      }
    };
  }, [token, uri, playerId, setToken]);

  useEffect(() => {
    if (player && deviceId && uri && !error) {
      console.log('SpotifyPlayer: Attempting playback:', { uri, deviceId });
      player
        .play({ uris: [uri] })
        .catch(err => {
          console.error('SpotifyPlayer: Playback error:', err);
          setError('Failed to play track. Please try again.');
        });
    }
  }, [player, deviceId, uri, error]);

  const handlePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pause();
      } else {
        player.resume();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (error) {
    return (
      <div className="bg-zinc-800 text-white p-4 rounded-lg">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (!uri || !title) {
    return null;
  }

  return (
    <div id={playerId} className="bg-zinc-800 text-white p-4 rounded-lg flex flex-col items-center">
      <img src={image} alt={title} className="w-32 h-32 rounded-lg mb-2" />
      <p className="text-sm font-medium truncate max-w-[200px]">{title}</p>
      <p className="text-xs text-zinc-400 truncate max-w-[200px]">{channelName}</p>
      <button
        onClick={handlePlayPause}
        className="mt-2 text-white hover:text-indigo-300 focus:outline-none"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <HiPause size={24} /> : <HiPlay size={24} />}
      </button>
    </div>
  );
};

export default SpotifyPlayer; */

/*import React, { useEffect, useState } from 'react';

const SpotifyPlayer = ({ token, uri }) => {
  const [player, setPlayer] = useState(null);
  const playerId = `spotify-player-${uri ? uri.split(':').pop() : 'default'}`;

  useEffect(() => {
    if (!token || !uri) {
      console.error('SpotifyPlayer: Missing token or URI', { token, uri });
      return;
    }
    // Load Spotify SDK
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log('✅ Spotify SDK Ready');

      const newPlayer = new window.Spotify.Player({
        name: 'Choco Web Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5,
      });

      // Error handling
      newPlayer.addListener('initialization_error', ({ message }) => {
        console.error('Init Error:', message);
      });
      newPlayer.addListener('authentication_error', ({ message }) => {
        console.error('Auth Error:', message);
      });
      newPlayer.addListener('account_error', ({ message }) => {
        console.error('Account Error:', message);
      });
      newPlayer.addListener('playback_error', ({ message }) => {
        console.error('Playback Error:', message);
      });

      // Playback status updates
      newPlayer.addListener('player_state_changed', state => {
        console.log('Player state changed:', state);
      });

      // Ready
      newPlayer.addListener('ready', async ({ device_id }) => {
        console.log('✅ Player ready with Device ID', device_id);
        try {
          // Transfer playback
          const transferRes = await fetch('https://api.spotify.com/v1/me/player', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ device_ids: [device_id], play: true }),
          });

          if (!transferRes.ok) {
            const err = await transferRes.json();
            console.error('Transfer error:', err);
            return;
          }

          // Play the track
          const playRes = await fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ uris: [uri] }),
          });

          if (!playRes.ok) {
            const err = await playRes.json();
            console.error('Play error:', err);
          }
        } catch (err) {
          console.error('Error in transfer/play:', err);
        }
      });

      // Not ready
      newPlayer.addListener('not_ready', ({ device_id }) => {
        console.warn('🚨 Device went offline', device_id);
      });

      // Connect
      newPlayer.connect()
        .then(success => console.log('Player connect status:', success))
        .catch(err => console.error('Player connect failed:', err));

      setPlayer(newPlayer);
    };

    return () => {
      if (player) {
        player.disconnect();
        console.log('❎ Spotify player disconnected');
      }
      const script = document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]');
      if (script) {
        script.remove();
      }
      const existingPlayer = document.getElementById(playerId);
      if (existingPlayer) {
        existingPlayer.remove();
      }
    };
  }, [token, uri, playerId]);

  if (!token || !uri) {
    return null; // Don't render if props are missing
  }

  return <div id={playerId} style={{ display: 'none' }} />;
};

export default SpotifyPlayer; 
---------------------------------------------------------------------------------------------------------------------------------*/
/*import React, { useEffect, useState } from 'react';

const SpotifyPlayer = ({ token, uri }) => {
  const [player, setPlayer] = useState(null);
  const playerId = `spotify-player-${uri ? uri.split(':').pop() : 'default'}`;
  const [deviceId, setDeviceId] = useState(null); // Track device ID

  useEffect(() => {
    if (!token || !uri) {
      console.error('SpotifyPlayer: Missing token or URI', { token, uri });
      return;
    }
    // Load Spotify SDK
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log('✅ Spotify SDK Ready');

      const newPlayer = new window.Spotify.Player({
        name: 'Choco Web Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5,
      });

      newPlayer.addListener('initialization_error', ({ message }) => {
        console.error('Init Error:', message);
      });
      newPlayer.addListener('authentication_error', ({ message }) => {
        console.error('Auth Error:', message);
      });
      newPlayer.addListener('account_error', ({ message }) => {
        console.error('Account Error:', message);
      });
      newPlayer.addListener('playback_error', ({ message }) => {
        console.error('Playback Error:', message);
      });

      // Playback status updates
      newPlayer.addListener('player_state_changed', state => {
        console.log('Player state changed:', state);
        if (state.paused) {
          // Update UI controls for pause state
        }
      });

      // Ready
      newPlayer.addListener('ready', async ({ device_id }) => {
        console.log('✅ Player ready with Device ID', device_id);
        setDeviceId(device_id); // Save device ID for later use
        try {
          // Transfer playback
          const transferRes = await fetch('https://api.spotify.com/v1/me/player', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ device_ids: [device_id], play: true }),
          });

          if (!transferRes.ok) {
            const err = await transferRes.json();
            console.error('Transfer error:', err);
            return;
          }

          // Play the track
          const playRes = await fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ uris: [uri] }),
          });

          if (!playRes.ok) {
            const err = await playRes.json();
            console.error('Play error:', err);
          }
        } catch (err) {
          console.error('Error in transfer/play:', err);
        }
      });

      // Not ready
      newPlayer.addListener('not_ready', ({ device_id }) => {
        console.warn('🚨 Device went offline', device_id);
      });

      // Connect
      newPlayer.connect()
        .then(success => console.log('Player connect status:', success))
        .catch(err => console.error('Player connect failed:', err));

      setPlayer(newPlayer);
    };

    return () => {
      if (player) {
        player.disconnect();
        console.log('❎ Spotify player disconnected');
      }
      const script = document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]');
      if (script) {
        script.remove();
      }
      const existingPlayer = document.getElementById(playerId);
      if (existingPlayer) {
        existingPlayer.remove();
      }
    };
  }, [token, uri, playerId]);

  if (!token || !uri || !deviceId) {
    return null; // Don't render if props are missing
  }

  return <div id={playerId} style={{ display: 'none' }} />;
};

export default SpotifyPlayer;
-------------------------------------ye vala ekdummast chalraha*/
import React, { useEffect, useState, useRef } from 'react';

const SpotifyPlayer = ({ token, uri }) => {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [paused, setPaused] = useState(true);
  const [track, setTrack] = useState(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!token || !uri) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const newPlayer = new window.Spotify.Player({
        name: 'React Spotify Player',
        getOAuthToken: cb => cb(token),
        volume: 0.5,
      });

      newPlayer.addListener('ready', async ({ device_id }) => {
        setDeviceId(device_id);

        // Transfer playback
        await fetch('https://api.spotify.com/v1/me/player', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            device_ids: [device_id],
            play: true,
          }),
        });

        // Start playing the song
        await fetch('https://api.spotify.com/v1/me/player/play', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uris: [uri] }),
        });
      });

      newPlayer.addListener('player_state_changed', state => {
        if (!state) return;

        const { paused, position, duration, track_window } = state;
        setPaused(paused);
        setPosition(position);
        setDuration(duration);
        setTrack(track_window.current_track);
      });

      newPlayer.connect();
      setPlayer(newPlayer);
    };

    return () => {
      if (player) player.disconnect();
      const sdkScript = document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]');
      if (sdkScript) sdkScript.remove();
      delete window.onSpotifyWebPlaybackSDKReady;
    };
  }, [token, uri]);

  // Track progress bar
  useEffect(() => {
    if (!paused && player) {
      intervalRef.current = setInterval(() => {
        player.getCurrentState().then(state => {
          if (state) setPosition(state.position);
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [paused, player]);

  const handlePlayPause = () => player && player.togglePlay();
  const handleNext = () => player && player.nextTrack();
  const handlePrevious = () => player && player.previousTrack();
  const handleSeek = (e) => {
    const newPos = (e.target.value / 100) * duration;
    player.seek(newPos);
    setPosition(newPos);
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: 12 }}>
      {track ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={track.album.images[0].url} alt="Album Art" width="64" height="64" />
            <div style={{ marginLeft: '1rem' }}>
              <strong>{track.name}</strong>
              <br />
              <span>{track.artists.map(a => a.name).join(', ')}</span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={duration ? (position / duration) * 100 : 0}
            onChange={handleSeek}
            style={{ width: '100%', marginTop: '1rem' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1rem' }}>
            <button onClick={handlePrevious}>⏮️</button>
            <button onClick={handlePlayPause}>{paused ? '▶️ Play' : '⏸️ Pause'}</button>
            <button onClick={handleNext}>⏭️</button>
          </div>
        </>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default SpotifyPlayer;


/*
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase-config';
import { doc, updateDoc } from 'firebase/firestore';
import { HiMusicalNote, HiPause, HiPlay } from 'react-icons/hi2';

const SpotifyPlayer = ({ token, uri, image, title, channelName }) => {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const playerId = `spotify-player-${uri ? uri.split(':').pop() : 'default'}`;
  const roomCode = sessionStorage.getItem('roomCode') || 'default'; // Fallback
  const roomRef = doc(db, 'room', roomCode);

  // Fetch track duration from Spotify API
  const fetchTrackInfo = async () => {
    try {
      const trackId = uri.split(':').pop();
      const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401) {
          sessionStorage.removeItem('spotify_token');
          navigate('/login');
        }
        throw new Error('Failed to fetch track info');
      }
      const data = await res.json();
      setDuration(data.duration_ms / 1000);
    } catch (err) {
      console.error('Error fetching track duration:', err);
      setDuration(0);
    }
  };

  // Cleanup existing players
  const cleanupExistingPlayers = () => {
    const existingPlayers = document.querySelectorAll('div[id^="spotify-player"]');
    existingPlayers.forEach(player => {
      if (player.id !== playerId) {
        player.remove();
      }
    });
  };

  useEffect(() => {
    if (!token || !uri) {
      console.error('SpotifyPlayer: Missing token or URI', { token, uri });
      setIsLoading(false);
      return;
    }

    cleanupExistingPlayers();
    setIsLoading(true);

    // Load Spotify SDK
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log('✅ Spotify SDK Ready');

      const spotifyPlayer = new window.Spotify.Player({
        name: 'Choco Web Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5,
      });

      // Error handling
      spotifyPlayer.addListener('initialization_error', ({ message }) => {
        console.error('Init Error:', message);
        setIsLoading(false);
      });
      spotifyPlayer.addListener('authentication_error', ({ message }) => {
        console.error('Auth Error:', message);
        sessionStorage.removeItem('spotify_token');
        navigate('/login');
      });
      spotifyPlayer.addListener('account_error', ({ message }) => {
        console.error('Account Error:', message);
        setIsLoading(false);
      });
      spotifyPlayer.addListener('playback_error', ({ message }) => {
        console.error('Playback Error:', message);
        setIsLoading(false);
      });

      // Playback status updates
      spotifyPlayer.addListener('player_state_changed', state => {
        if (state) {
          setIsPlaying(!state.paused);
          setCurrentTime(state.position / 1000);
          if (state.duration && !duration) {
            setDuration(state.duration / 1000);
          }
          updateFirebaseState(!state.paused, state.position / 1000);
          setIsLoading(false);
        }
      });

      // Ready
      spotifyPlayer.addListener('ready', async ({ device_id }) => {
        console.log('✅ Player ready with Device ID', device_id);
        try {
          // Transfer playback
          const transferRes = await fetch('https://api.spotify.com/v1/me/player', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ device_ids: [device_id], play: true }),
          });

          if (!transferRes.ok) {
            const err = await transferRes.json();
            console.error('Transfer error:', err);
            if (transferRes.status === 401) {
              sessionStorage.removeItem('spotify_token');
              navigate('/login');
            }
            setIsLoading(false);
            return;
          }

          // Play the track
          const playRes = await fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ uris: [uri] }),
          });

          if (!playRes.ok) {
            const err = await playRes.json();
            console.error('Play error:', err);
            if (playRes.status === 401) {
              sessionStorage.removeItem('spotify_token');
              navigate('/login');
            }
            setIsLoading(false);
            return;
          }

          // Fetch duration if not set
          if (!duration) {
            await fetchTrackInfo();
          }
        } catch (err) {
          console.error('Error in transfer/play:', err);
          setIsLoading(false);
        }
      });

      // Not ready
      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.warn('🚨 Device went offline', device_id);
        setIsLoading(false);
      });

      spotifyPlayer.connect()
        .then(success => console.log('Player connect status:', success))
        .catch(err => {
          console.error('Player connect failed:', err);
          setIsLoading(false);
        });

      setPlayer(spotifyPlayer);
    };

    return () => {
      if (player) {
        player.disconnect();
        console.log('❎ Spotify player disconnected');
      }
      const script = document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]');
      if (script) {
        script.remove();
      }
      const existingPlayer = document.getElementById(playerId);
      if (existingPlayer) {
        existingPlayer.remove();
      }
      clearInterval(intervalRef.current);
    };
  }, [token, uri, playerId, duration, navigate]);

  const updateFirebaseState = async (playing, time) => {
    try {
      await updateDoc(roomRef, {
        isPlaying: playing,
        currentTime: time,
        lastUpdated: Date.now(),
      });
    } catch (err) {
      console.error('Error updating Firebase:', err);
    }
  };

  const handlePlayPause = async () => {
    if (player) {
      if (isPlaying) {
        player.pause();
      } else {
        player.resume();
      }
      setIsPlaying(!isPlaying);
      await updateFirebaseState(!isPlaying, currentTime);
    }
  };

  const handleSeek = async (e) => {
    const newTime = parseFloat(e.target.value);
    if (player) {
      try {
        await fetch('https://api.spotify.com/v1/me/player/seek', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ position_ms: newTime * 1000 }),
        });
        setCurrentTime(newTime);
        await updateDoc(roomRef, {
          currentTime: newTime,
          lastUpdated: Date.now(),
        });
      } catch (err) {
        console.error('Error seeking:', err);
        if (err.message.includes('401')) {
          sessionStorage.removeItem('spotify_token');
          navigate('/login');
        }
      }
    }
  };

  if (!token || !uri) {
    return null;
  }

  return (
    <div className="w-full h-[200px] bg-zinc-800 rounded-lg flex flex-col justify-center items-center p-4 relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 bg-opacity-75 rounded-lg">
          <p className="text-white text-sm">Loading Spotify Player...</p>
        </div>
      )}
      {image ? (
        <img src={image} alt={title} className="w-32 h-32 rounded-md object-cover mb-2" />
      ) : (
        <HiMusicalNote color="white" size={86} />
      )}
      <div className="text-center text-white">
        <p className="text-sm font-medium truncate max-w-[200px]">{title || 'Unknown Track'}</p>
        <p className="text-xs text-zinc-400 truncate max-w-[200px]">{channelName || 'Unknown Artist'}</p>
      </div>
      <div className="flex items-center gap-4 mt-2 w-full justify-center">
        <button
          onClick={handlePlayPause}
          className="text-white hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <HiPause size={24} /> : <HiPlay size={24} />}
        </button>
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-32 accent-indigo-500 hover:accent-indigo-400"
          aria-label="Seek track"
        />
      </div>
    </div>
  );
};

export default SpotifyPlayer; */
/*
import React, { useEffect, useState } from 'react';

const SpotifyPlayer = ({ token, uri }) => {
  const [player, setPlayer] = useState(null);
  const playerId = `spotify-player-${uri ? uri.split(':').pop() : 'default'}`;

  useEffect(() => {
    if (!token || !uri) {
      console.error('SpotifyPlayer: Missing token or URI', { token, uri });
      return;
    }

    // Load Spotify SDK
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log('✅ Spotify SDK Ready');

      const newPlayer = new window.Spotify.Player({
        name: 'Choco Web Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5,
      });

      // Error handling
      newPlayer.addListener('initialization_error', ({ message }) => {
        console.error('Init Error:', message);
      });
      newPlayer.addListener('authentication_error', ({ message }) => {
        console.error('Auth Error:', message);
      });
      newPlayer.addListener('account_error', ({ message }) => {
        console.error('Account Error:', message);
      });
      newPlayer.addListener('playback_error', ({ message }) => {
        console.error('Playback Error:', message);
      });

      // Playback status updates
      newPlayer.addListener('player_state_changed', state => {
        console.log('Player state changed:', state);
      });

      // Ready
      newPlayer.addListener('ready', async ({ device_id }) => {
        console.log('✅ Player ready with Device ID', device_id);
        try {
          // Transfer playback
          const transferRes = await fetch('https://api.spotify.com/v1/me/player', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ device_ids: [device_id], play: true }),
          });

          if (!transferRes.ok) {
            const err = await transferRes.json();
            console.error('Transfer error:', err);
            return;
          }

          // Play the track
          const playRes = await fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ uris: [uri] }),
          });

          if (!playRes.ok) {
            const err = await playRes.json();
            console.error('Play error:', err);
          }
        } catch (err) {
          console.error('Error in transfer/play:', err);
        }
      });

      // Not ready
      newPlayer.addListener('not_ready', ({ device_id }) => {
        console.warn('🚨 Device went offline', device_id);
      });

      // Connect
      newPlayer.connect()
        .then(success => console.log('Player connect status:', success))
        .catch(err => console.error('Player connect failed:', err));

      setPlayer(newPlayer);
    };

    return () => {
      if (player) {
        player.disconnect();
        console.log('❎ Spotify player disconnected');
      }
      const script = document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]');
      if (script) {
        script.remove();
      }
      const existingPlayer = document.getElementById(playerId);
      if (existingPlayer) {
        existingPlayer.remove();
      }
    };
  }, [token, uri, playerId]);

  if (!token || !uri) {
    return null; // Don't render if props are missing
  }

  return <div id={playerId} style={{ display: 'none' }} />;
};

export default SpotifyPlayer;
*/
