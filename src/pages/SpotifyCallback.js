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
  console.log("Received code:", code); // ✅ debug

  if (!code) {
    console.warn("No code found in URL");
    return;
  }

  try {
    console.log("Sending POST request to exchange code...");
    const response = await axios.post('https://choco-flax.vercel.app/api/spotify/token', { code });
    console.log("Response from token API:", response.data);
    const token = response.data.access_token;
    setToken(token);
    sessionStorage.setItem('spotify_token', token);
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

