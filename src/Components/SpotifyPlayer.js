
// src/components/SpotifyPlayer.js
import React, { useEffect, useState, useRef } from 'react';
import { useStateContext } from '../Context/ContextProvider';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase-config';

let spotifyPlayerInstance = null;

const SpotifyPlayer = ({ token, uri }) => {
  const {
    videoIds, currentPlaying, setCurrentPlaying,
    setCurrentTrack, isPlaying
  } = useStateContext();

  const [player, setPlayer] = useState(null);
  const [paused, setPaused] = useState(true);
  const [track, setTrack] = useState(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef(null);

  const roomCode = sessionStorage.getItem('roomCode') || 'default';
  const docRef = doc(db, 'room', roomCode);

  useEffect(() => {
    if (!token || !uri) return;

    const loadSpotifyPlayer = () => {
      if (!window.Spotify || spotifyPlayerInstance) return;

      const newPlayer = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => cb(token),
        volume: 0.5,
      });

      newPlayer.addListener('ready', async ({ device_id }) => {
        await fetch('https://api.spotify.com/v1/me/player', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            device_ids: [device_id],
            play: true,
          }),
        });

        await fetch(`https://api.spotify.com/v1/me/player/play`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
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
      spotifyPlayerInstance = newPlayer;
    };

    if (!window.Spotify) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
      script.onload = loadSpotifyPlayer;
    } else {
      loadSpotifyPlayer();
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [token, uri]);

  // 🔄 Force play when URI changes
  useEffect(() => {
    if (!player || !uri) return;

    const playNewUri = async () => {
      try {
        await fetch('https://api.spotify.com/v1/me/player/play', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uris: [uri] }),
        });
      } catch (err) {
        console.error('Failed to play new track:', err);
      }
    };

    playNewUri();
  }, [uri, player]);

  useEffect(() => {
    if (player && !paused) {
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

  const handlePlayPause = () => player?.togglePlay();

  const handleSeek = (e) => {
    const newPos = (e.target.value / 100) * duration;
    player.seek(newPos);
    setPosition(newPos);
  };

  // 🔁 Custom queue-based next/previous
  const goToTrack = async (index) => {
    const nextTrack = videoIds[index];
    if (!nextTrack) return;

    await updateDoc(docRef, {
      currentPlaying: nextTrack,
      isPlaying: true,
      currentTime: 0,
      lastUpdated: Date.now(),
    });

    setCurrentPlaying(nextTrack);
    setCurrentTrack({
      type: nextTrack.platform,
      videoId: nextTrack.videoId,
      uri: nextTrack.uri,
    });
  };

  const handleNext = () => {
    const currentIndex = videoIds.findIndex(t => t.id === currentPlaying?.id);
    if (currentIndex < videoIds.length - 1) goToTrack(currentIndex + 1);
  };

  const handlePrevious = () => {
    const currentIndex = videoIds.findIndex(t => t.id === currentPlaying?.id);
    if (currentIndex > 0) goToTrack(currentIndex - 1);
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: 16, backgroundColor: '#f9f9f9' }}>
      {track ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={track.album.images[0].url}
              alt="Album Art"
              width="128"
              height="128"
              style={{ borderRadius: 8 }}
            />
            <div style={{ marginLeft: '1.5rem' }}>
              <strong style={{ fontSize: '1.5rem' }}>{track.name}</strong>
              <br />
              <span style={{ fontSize: '1.2rem' }}>{track.artists.map(a => a.name).join(', ')}</span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={duration ? (position / duration) * 100 : 0}
            onChange={handleSeek}
            style={{ width: '100%', marginTop: '1.5rem', height: '8px' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1.5rem' }}>
            <button onClick={handlePrevious}>⏮️</button>
            <button onClick={handlePlayPause}>
              {paused ? '▶️ Play' : '⏸️ Pause'}
            </button>
            <button onClick={handleNext}>⏭️</button>
          </div>
        </>
      ) : (
        <p>Loading Spotify Player...</p>
      )}
    </div>
  );
};

export default SpotifyPlayer;

