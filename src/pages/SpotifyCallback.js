import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../Context/ContextProvider';

const SpotifyCallback = () => {
  const { setToken } = useStateContext();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const accessToken = new URLSearchParams(hash.substring(1)).get('access_token');

    if (accessToken) {
      setToken(accessToken);
      localStorage.setItem('spotifyAccessToken', accessToken);
      navigate('/');
    }
  }, [setToken, navigate]);

  return null;
};

export default SpotifyCallback;
