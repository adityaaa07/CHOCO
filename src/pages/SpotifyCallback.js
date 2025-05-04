import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../Context/ContextProvider';
import Cookies from 'js-cookie';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase-config';
const SpotifyCallback = () => {
  const navigate = useNavigate();
  const { setToken, setLoginSource } = useStateContext();

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
        setLoginSource('spotify');
        navigate('/home');
        console.log('Spotify token refreshed');
      } else {
        console.error('No access token in refresh response');
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to refresh token:', error.message);
      navigate('/');
    }
  };

  const fetchUserInfo = async (accessToken) => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { display_name, id, email } = response.data;
      sessionStorage.setItem('spotify_user_id', id);
      Cookies.set('name', display_name || email || id);
      Cookies.set('email', email || '');
      console.log('Spotify user info fetched:', display_name || id);
    } catch (error) {
      console.error('Error fetching Spotify user info:', error.message);
    }
  };

  useEffect(() => {
    const storedToken = sessionStorage.getItem('spotify_token');
    const expiry = sessionStorage.getItem('spotify_token_expiry');

    if (storedToken && expiry && Date.now() < parseInt(expiry)) {
      localStorage.setItem('loginSource', 'spotify');
      localStorage.setItem('spotify_access_token', storedToken);
      setToken(storedToken);
      setLoginSource('spotify');
      fetchUserInfo(storedToken);
      navigate('/home');
    } else if (sessionStorage.getItem('spotify_refresh_token')) {
      refreshSpotifyToken();
    }
  }, [navigate, setToken, setLoginSource]);

  useEffect(() => {
    const fetchToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (!code) {
        console.warn('No code found in URL');
        navigate('/');
        return;
      }
      try {
        await signInAnonymously(auth);
        console.log('Signed in anonymously to Firebase');
        const response = await axios.post('https://choco-flax.vercel.app/api/spotify/token', { code });
        const { access_token, refresh_token, expires_in } = response.data;
        if (access_token) {
          sessionStorage.setItem('spotify_token', access_token);
          sessionStorage.setItem('spotify_refresh_token', refresh_token);
          sessionStorage.setItem('spotify_token_expiry', Date.now() + expires_in * 1000);
          localStorage.setItem('spotify_access_token', access_token);
          localStorage.setItem('loginSource', 'spotify');
          setToken(access_token);
          setLoginSource('spotify');
          await fetchUserInfo(access_token);
          navigate('/home');
        } else {
          console.error('Access token missing in response');
          navigate('/');
        }
      } catch (error) {
        console.error('Error getting Spotify token:', error.message);
        navigate('/');
      }
    };
    fetchToken();
  }, [setToken, setLoginSource, navigate]);

  return <div className="text-white p-4">Authenticating with Spotify...</div>;
};

export default SpotifyCallback;

/*
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
