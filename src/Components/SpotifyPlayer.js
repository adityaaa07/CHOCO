// Components/SpotifyPlayer.js
import React, { useEffect, useState } from 'react';

const SpotifyPlayer = ({ token, uri }) => {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const newPlayer = new window.Spotify.Player({
        name: 'Choco Web Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
      });

      newPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        // Transfer playback to this device
        fetch(`https://api.spotify.com/v1/me/player`, {
          method: 'PUT',
          body: JSON.stringify({
            device_ids: [device_id],
            play: true,
          }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }).then(() => {
          if (uri) {
            fetch(`https://api.spotify.com/v1/me/player/play`, {
              method: 'PUT',
              body: JSON.stringify({ uris: [uri] }),
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
            });
          }
        });
      });

      newPlayer.connect();
      setPlayer(newPlayer);
    };

    return () => {
      if (player) player.disconnect();
    };
  }, [token, uri]);
};

export default SpotifyPlayer;
