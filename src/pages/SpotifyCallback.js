
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../Context/ContextProvider";

const SpotifyCallback = () => {
  const navigate = useNavigate();
  const { setToken } = useStateContext();

  useEffect(() => {
    const hash = window.location.hash;
    const token = new URLSearchParams(hash.replace('#', '?')).get('access_token');

    if (token) {
      sessionStorage.setItem('spotifyToken', token);  // ✅ store it
      setToken(token);  // ✅ update context
      navigate('/');  // or wherever
    } else {
      console.error("Spotify token not found in callback.");
    }
  }, [setToken, navigate]);

  return <p>Logging you in via Spotify...</p>;
};

export default SpotifyCallback;
