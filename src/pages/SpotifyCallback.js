
import axios from 'axios';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../Context/ContextProvider";

const SpotifyCallback = () => {
  const navigate = useNavigate();
  const { setToken } = useStateContext();

  // 🔁 Refresh access token if expired
  const refreshSpotifyToken = async () => {
    const refreshToken = sessionStorage.getItem('spotify_refresh_token');
    if (!refreshToken) return;

    try {
      const response = await axios.post('https://choco-flax.vercel.app/api/spotify/refresh', {
        refresh_token: refreshToken,
      });

      const { access_token, expires_in } = response.data;
      if (access_token) {
        // 🔐 Store updated token
        sessionStorage.setItem('spotify_token', access_token);
        sessionStorage.setItem('spotify_token_expiry', Date.now() + expires_in * 1000);
        localStorage.setItem('spotify_access_token', access_token);
        localStorage.setItem('loginSource', 'spotify');

        setToken(access_token);
        navigate('/home');
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
    }
  };

  // ✅ Try to skip re-auth if valid token exists
  useEffect(() => {
    const storedToken = sessionStorage.getItem('spotify_token');
    const expiry = sessionStorage.getItem('spotify_token_expiry');

    if (storedToken && expiry && Date.now() < parseInt(expiry)) {
      localStorage.setItem('loginSource', 'spotify');
      localStorage.setItem('spotify_access_token', storedToken);

      setToken(storedToken);
      navigate('/home');
    } else if (sessionStorage.getItem('spotify_refresh_token')) {
      refreshSpotifyToken();
    }
  }, [navigate, setToken]);

  // 🔁 Handle Spotify redirect with `code`
  useEffect(() => {
    const fetchToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      console.log("Received code:", code);

      if (!code) {
        console.warn("No code found in URL");
        return;
      }

      try {
        const response = await axios.post('https://choco-flax.vercel.app/api/spotify/token', { code });
        console.log("Response from token API:", response.data);

        const { access_token, refresh_token, expires_in } = response.data;

        if (access_token) {
          // ✅ Store everything
          sessionStorage.setItem('spotify_token', access_token);
          sessionStorage.setItem('spotify_refresh_token', refresh_token);
          sessionStorage.setItem('spotify_token_expiry', Date.now() + expires_in * 1000);

          localStorage.setItem('spotify_access_token', access_token);
          localStorage.setItem('loginSource', 'spotify');

          setToken(access_token);
          navigate('/home');
        } else {
          console.error("Access token missing in response");
        }
      } catch (error) {
        console.error('Error getting Spotify token:', error);
      }
    };

    fetchToken();
  }, [setToken, navigate]);

  return <div className="text-white p-4">Authenticating with Spotify...</div>;
};

export default SpotifyCallback;

