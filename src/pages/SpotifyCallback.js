import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SpotifyCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getToken = async () => {
      const code = new URLSearchParams(window.location.search).get("code");

      if (!code) {
        console.error("No code found in callback URL");
        return;
      }

      try {
        const params = new URLSearchParams();
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("redirect_uri", process.env.REACT_APP_SPOTIFY_REDIRECT_URI);
        params.append("client_id", process.env.REACT_APP_SPOTIFY_CLIENT_ID);
        params.append("client_secret", process.env.REACT_APP_SPOTIFY_CLIENT_SECRET);

        const response = await axios.post("https://accounts.spotify.com/api/token", params, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        const { access_token, refresh_token, expires_in } = response.data;

        // Save tokens in localStorage or Firebase (temporary: localStorage)
        localStorage.setItem("spotifyAccessToken", access_token);
        localStorage.setItem("spotifyRefreshToken", refresh_token);
        localStorage.setItem("spotifyExpiresIn", Date.now() + expires_in * 1000);

        console.log("Spotify tokens saved!");

        navigate("/"); // Go back to homepage
      } catch (error) {
        console.error("Error fetching Spotify token:", error);
      }
    };

    getToken();
  }, [navigate]);

  return (
   <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl">Connecting to Spotify...</h1>
    </div>
  );
};

export default SpotifyCallback;

/*import axios from 'axios';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../Context/ContextProvider";

const SpotifyCallback = () => {
  const navigate = useNavigate();
  const { setToken } = useStateContext();

 useEffect(() => {
    const fetchToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (!code) return;

      try {
        const response = await axios.post('https://your-backend.com/api/spotify/token', { code });
        const token = response.data.access_token;
        setToken(token);
        localStorage.setItem('spotify_access_token', token);
        navigate('/');
      } catch (error) {
        console.error('Error getting Spotify token:', error);
      }
    };

    fetchToken();
  }, [setToken, navigate]);

  return <div>Authenticating with Spotify...</div>;
};

export default SpotifyCallback;
*/
