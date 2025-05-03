import React, { useEffect, useState } from 'react';

const SpotifyPlayer = ({ token, uri }) => {
  const [player, setPlayer] = useState(null);
  const playerId = `spotify-player-${uri ? uri.split(':').pop() : 'default'}`;

  useEffect(() => {
    if (!token || !uri) {
      console.error('SpotifyPlayer: Missing token or URI');
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
      // Cleanup
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

  return <div id={playerId} style={{ display: 'none' }} />;
};

export default SpotifyPlayer;
