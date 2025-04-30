import React, { useEffect } from 'react';

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "code";
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
    window.location.href = authUrl;
  };
  
/*useEffect(() => {
  const hash = window.location.hash
    .substring(1)
    .split("&")
    .reduce((initial, item) => {
      if (item) {
        const parts = item.split("=");
        initial[parts[0]] = decodeURIComponent(parts[1]);
      }
      return initial;
    }, {});*/

  if (hash.access_token) {
    localStorage.setItem("spotify_access_token", hash.access_token);
    sessionStorage.setItem("spotify_token", hash.access_token); // optional backup
    window.location.hash = ""; // Clean up URL
  }
}, []);
  
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

/*import React from 'react';

const SpotifyAuth = () => {
  const handleSpotifyLogin = () => {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-read-playback-state',
      'user-modify-playback-state',
      'streaming',
    ];

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}`;

    window.location.href = authUrl;
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={handleSpotifyLogin}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-md shadow-md transition-all duration-200"
      >
        Login with Spotify
      </button>
    </div>
  );
};

export default SpotifyAuth;
*/
