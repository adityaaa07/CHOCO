// src/components/SpotifyPlayer.js
import React, { useEffect, useState } from 'react';

const SpotifyPlayer = ({ token, uri }) => {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (!token) {
      console.error('SpotifyPlayer: no token provided');
      return;
    }

    // 1) Load the SDK script
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    // 2) Wait for SDK to be ready
    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log('✅ Spotify SDK Ready');

      const newPlayer = new window.Spotify.Player({
        name: 'Choco Web Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
      });

      // 3) Error handling
      newPlayer.addListener('initialization_error', ({ message }) => { console.error('Init Error:', message); });
      newPlayer.addListener('authentication_error', ({ message }) => { console.error('Auth Error:', message); });
      newPlayer.addListener('account_error', ({ message }) => { console.error('Account Error:', message); });
      newPlayer.addListener('playback_error', ({ message }) => { console.error('Playback Error:', message); });

      // 4) Playback status updates
      newPlayer.addListener('player_state_changed', state => {
        console.log('Player state changed:', state);
      });

      // 5) Ready
      newPlayer.addListener('ready', async ({ device_id }) => {
        console.log('✅ Player ready with Device ID', device_id);

        // 6) Transfer playback
        try {
          const transferRes = await fetch('https://api.spotify.com/v1/me/player', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ device_ids: [device_id], play: true })
          });
          console.log('Transfer playback response status:', transferRes.status);
          if (!transferRes.ok) {
            const err = await transferRes.json();
            console.error('Transfer error:', err);
            return;
          }

          // 7) Play the desired track
          if (uri) {
            const playRes = await fetch('https://api.spotify.com/v1/me/player/play', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ uris: [uri] })
            });
            console.log('Play track response status:', playRes.status);
            if (!playRes.ok) {
              const err = await playRes.json();
              console.error('Play error:', err);
            }
          }
        } catch (err) {
          console.error('Error in transfer/play:', err);
        }
      });

      // 8) Not ready
      newPlayer.addListener('not_ready', ({ device_id }) => {
        console.warn('🚨 Device went offline', device_id);
      });

      // 9) Connect!
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
    };
  }, [token, uri]);

  return null;
};

export default SpotifyPlayer;

