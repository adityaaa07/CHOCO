import axios from 'axios';
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

