import React from 'react';

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

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}`;

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
