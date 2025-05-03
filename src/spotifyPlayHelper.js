// spotifyPlayHelper.js
import Cookies from 'js-cookie';

export const getSpotifyAccessToken = () => {
  const token = Cookies.get('spotifyAccessToken');
  if (!token) {
    console.error('No Spotify access token found!');
  }
  return token;
};

export const playSpotifyTrack = async (trackUri) => {
  const token = getSpotifyAccessToken();
  const device_id = localStorage.getItem('spotifyDeviceId'); // save deviceId when ready

  if (!token || !device_id) {
    console.error('Missing token or device ID for Spotify playback.');
    return;
  }

  try {
    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
      method: "PUT",
      body: JSON.stringify({ uris: [trackUri] }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    console.log('Spotify track started playing');
  } catch (error) {
    console.error('Error playing Spotify track:', error);
  }
};
/*
import Cookies from 'js-cookie';

export const getSpotifyAccessToken = () => {
  const token = Cookies.get('spotifyAccessToken');
  if (!token) {
    console.error('No Spotify access token found!');
  }
  return token;
};

export const playSpotifyTrack = async (trackUri) => {
  const token = getSpotifyAccessToken();
  const device_id = localStorage.getItem('spotifyDeviceId'); // save deviceId when ready

  if (!token || !device_id) {
    console.error('Missing token or device ID for Spotify playback.');
    return;
  }

  try {
    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
      method: "PUT",
      body: JSON.stringify({ uris: [trackUri] }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    console.log('Spotify track started playing');
  } catch (error) {
    console.error('Error playing Spotify track:', error);
  }
};
*/
