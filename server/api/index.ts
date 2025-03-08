import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/index';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Forward the request to your Express app
  return new Promise((resolve, reject) => {
    app(req, res);
    // Resolve when the response is finished
    res.on('finish', resolve);
    res.on('error', reject);
  });
} 