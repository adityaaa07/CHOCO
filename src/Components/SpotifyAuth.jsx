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
  "user-read-currently-playing",
];

const SpotifyAuth = () => {
  const loginSpotify = () => {
    const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=${RESPONSE_TYPE}&scope=${SCOPES.join("%20")}`;
    window.location.href = authUrl; // Redirect user to Spotify's authentication page
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        onClick={loginSpotify}
        className="bg-white flex items-center hover:bg-green-700 text-black py-2 px-4 rounded"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg"
          alt="Spotify Logo"
          className="w-6 h-6 mr-2"
        />
        <span>Login with Spotify</span>
      </button>
    </div>
  );
};

export default SpotifyAuth;
