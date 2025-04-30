import React from 'react';

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "code";  // Authorization Code Flow
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "streaming",
  "user-read-playback-state",
  "user-modify-playback-state",
  "playlist-read-private",
  "playlist-read-collaborative",
];

const SpotifyAuth = () => {
  const loginSpotify = () => {
    const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=${RESPONSE_TYPE}&scope=${SCOPES.join("%20")}`;
    window.location.href = authUrl; // Redirect user to Spotify's authentication page
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-4">Login to Spotify</h1>
      <button
        onClick={loginSpotify}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Connect Spotify
      </button>
    </div>
  );
};

export default SpotifyAuth;
