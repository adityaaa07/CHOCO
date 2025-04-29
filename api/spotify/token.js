export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { code } = req.body;

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', process.env.REACT_APP_SPOTIFY_REDIRECT_URI);
  params.append('client_id', process.env.REACT_APP_SPOTIFY_CLIENT_ID);
  params.append('client_secret', process.env.REACT_APP_SPOTIFY_CLIENT_SECRET);

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error_description });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error exchanging token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
