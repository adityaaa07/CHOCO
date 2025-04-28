import axios from "axios";

export const getSpotifyAccessToken = async () => {
  const expiry = parseInt(localStorage.getItem("spotifyExpiresIn"));
  const accessToken = localStorage.getItem("spotifyAccessToken");
  const refreshToken = localStorage.getItem("spotifyRefreshToken");

  if (Date.now() > expiry) {
    console.log("Refreshing Spotify access token...");
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", refreshToken);
    params.append("client_id", process.env.REACT_APP_SPOTIFY_CLIENT_ID);
    params.append("client_secret", process.env.REACT_APP_SPOTIFY_CLIENT_SECRET);

    const response = await axios.post("https://accounts.spotify.com/api/token", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { access_token, expires_in } = response.data;

    localStorage.setItem("spotifyAccessToken", access_token);
    localStorage.setItem("spotifyExpiresIn", Date.now() + expires_in * 1000);

    return access_token;
  }

  return accessToken;
};

/*
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
*/
