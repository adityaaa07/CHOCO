import React, { useEffect } from 'react';
import { useStateContext } from '../Context/ContextProvider';

const SpotifyPlayer = () => {
  const {
    token,
    setPlayerReady,
    setDeviceId,
    setPlayer
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

  return null;
};

export default SpotifyPlayer;
