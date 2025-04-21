import React, { useEffect } from 'react';
import { useStateContext } from '../Context/ContextProvider';

const SpotifyPlayer = () => {
  const {
    token,
    setPlayerReady,
    setDeviceId,
    setPlayer,
    currentPlaying,
    deviceId
  } = useStateContext();

  useEffect(() => {
    if (!token) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
      });

      player.addListener('ready', ({ device_id }) => {
        setDeviceId(device_id);
        setPlayerReady(true);
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.connect();
      setPlayer(player);
    };
  }, [token, setPlayerReady, setDeviceId, setPlayer]);

  // 🔽 New Effect: Trigger playback when `currentPlaying` is a Spotify track
  useEffect(() => {
    const playSpotify = async () => {
      if (
        currentPlaying?.platform === 'spotify' &&
        currentPlaying?.uri &&
        deviceId &&
        token
      ) {
        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
          method: 'PUT',
          body: JSON.stringify({ uris: [currentPlaying.uri] }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }).catch(err => console.error('Playback error:', err));
      }
    };

    playSpotify();
  }, [currentPlaying, deviceId, token]); // 🔁 Runs when song/device/token is ready

  return null;
};

export default SpotifyPlayer;
