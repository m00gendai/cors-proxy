export default async function handler(req, res) {
  try {
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(204).end();
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST, OPTIONS');
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { targetUrl, allowedOrigin, fetchMethod = 'POST', payload } = await req.json?.() || {};

    if (!targetUrl) return res.status(400).json({ error: 'Missing targetUrl' });

    const options = {
      method: fetchMethod.toUpperCase(),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (compatible; FAAProxy/1.0)'
      }
    };

    if (fetchMethod.toUpperCase() === 'POST') {
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
      options.body = payload || '';
    }

    const upstreamRes = await fetch(targetUrl, options);
    const text = await upstreamRes.text();

    res.setHeader('Access-Control-Allow-Origin', allowedOrigin || '*');
    res.status(upstreamRes.status).send(text);

  } catch (err) {
    console.error(err);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
}
