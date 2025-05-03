import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStateContext } from '../Context/ContextProvider';

const SpotifyCallback = () => {
  const navigate = useNavigate();
  const { setToken } = useStateContext();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      // Handle OAuth error
      if (error) {
        console.error('SpotifyCallback: OAuth error:', error);
        navigate('/');
        return;
      }

      // Check for existing valid token
      const storedToken = sessionStorage.getItem('spotify_token');
      const expiry = sessionStorage.getItem('spotify_token_expiry');
      if (storedToken && expiry && Date.now() < parseInt(expiry)) {
        console.log('SpotifyCallback: Using existing valid token:', storedToken);
        setToken(storedToken);
        navigate('/home');
        return;
      }

      // Refresh token if available
      const refreshToken = sessionStorage.getItem('spotify_refresh_token');
      if (!code && refreshToken) {
        try {
          console.log('SpotifyCallback: Refreshing token');
          const response = await axios.post('https://choco-flax.vercel.app/api/spotify/refresh', {
            refresh_token: refreshToken,
          });
          const { access_token, expires_in } = response.data;
          if (access_token) {
            sessionStorage.setItem('spotify_token', access_token);
            sessionStorage.setItem('spotify_token_expiry', Date.now() + expires_in * 1000);
            setToken(access_token);
            console.log('SpotifyCallback: Token refreshed:', access_token);
            navigate('/home');
          } else {
            console.error('SpotifyCallback: No access token in refresh response');
            navigate('/');
          }
        } catch (error) {
          console.error('SpotifyCallback: Failed to refresh token:', error.response?.data || error.message);
          navigate('/');
        }
        return;
      }

      // Handle OAuth code exchange
      if (!code) {
        console.warn('SpotifyCallback: No code found in URL');
        navigate('/');
        return;
      }

      try {
        console.log('SpotifyCallback: Exchanging code for token');
        const response = await axios.post('https://choco-flax.vercel.app/api/spotify/token', { code });
        const { access_token, refresh_token, expires_in } = response.data;
        if (access_token) {
          sessionStorage.setItem('spotify_token', access_token);
          sessionStorage.setItem('spotify_refresh_token', refresh_token);
          sessionStorage.setItem('spotify_token_expiry', Date.now() + expires_in * 1000);
          setToken(access_token);
          console.log('SpotifyCallback: Token stored:', access_token);
          navigate('/home');
        } else {
          console.error('SpotifyCallback: Access token missing in response');
          navigate('/');
        }
      } catch (error) {
        console.error('SpotifyCallback: Error getting Spotify token:', error.response?.data || error.message);
        navigate('/');
      }
    };

    handleCallback();
  }, [navigate, setToken]);

  return <div className="text-white p-4">Authenticating with Spotify...</div>;
};

export default SpotifyCallback;
/* 
latest
import axios from 'axios';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../Context/ContextProvider";
const SpotifyCallback = () => {
  const navigate = useNavigate();
  const { setToken } = useStateContext();

  const refreshSpotifyToken = async () => {
    const refreshToken = sessionStorage.getItem('spotify_refresh_token');
    if (!refreshToken) {
      console.error('No refresh token found');
      navigate('/');
      return;
    }

    try {
      const response = await axios.post('https://choco-flax.vercel.app/api/spotify/refresh', {
        refresh_token: refreshToken,
      });

      const { access_token, expires_in } = response.data;
      if (access_token) {
        sessionStorage.setItem('spotify_token', access_token);
        sessionStorage.setItem('spotify_token_expiry', Date.now() + expires_in * 1000);
        localStorage.setItem('spotify_access_token', access_token);
        localStorage.setItem('loginSource', 'spotify');
        setToken(access_token);
        navigate('/home');
      } else {
        console.error('No access token in refresh response');
        navigate('/');
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      navigate('/');
    }
  };

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

  useEffect(() => {
    const fetchToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      console.log("Received code:", code);

      if (!code) {
        console.warn("No code found in URL");
        navigate('/');
        return;
      }

      try {
        const response = await axios.post('https://choco-flax.vercel.app/api/spotify/token', { code });
        console.log("Token API response:", response.data);

        const { access_token, refresh_token, expires_in } = response.data;

        if (access_token) {
          sessionStorage.setItem('spotify_token', access_token);
          sessionStorage.setItem('spotify_refresh_token', refresh_token);
          sessionStorage.setItem('spotify_token_expiry', Date.now() + expires_in * 1000);
          localStorage.setItem('spotify_access_token', access_token);
          localStorage.setItem('loginSource', 'spotify');
          setToken(access_token);
          navigate('/home');
        } else {
          console.error("Access token missing in response");
          navigate('/');
        }
      } catch (error) {
        console.error('Error getting Spotify token:', error.response?.data || error.message);
        navigate('/');
      }
    };

    fetchToken();
  }, [setToken, navigate]);

  return <div className="text-white p-4">Authenticating with Spotify...</div>;
};

export default SpotifyCallback;
*/
