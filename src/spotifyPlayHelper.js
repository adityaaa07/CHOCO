
export async function playSpotifyTrack(trackUri, token) {
  const deviceId = window.SPOTIFY_DEVICE_ID;
  if (!deviceId) {
    console.error('Spotify device ID not available');
    return;
  }

  try {
    const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uris: [trackUri],
      }),
    });

    if (!response.ok) {
      console.error('Failed to play Spotify track:', await response.text());
    }
  } catch (err) {
    console.error('Error playing Spotify track:', err);
  }
}

