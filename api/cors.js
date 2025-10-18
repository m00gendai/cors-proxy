const ALLOWED_ORIGIN = 'https://aim-mapping-tool.mrweber.ch';

export default async function handler(req, res) {
  try {
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(204).end();
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST, OPTIONS');
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const response = await fetch('https://notams.aim.faa.gov/notamSearch/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    res.status(response.status).send(text);
  } catch (err) {
    console.error(err);
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    res.status(500).json({ error: 'Proxy error' });
  }
}
