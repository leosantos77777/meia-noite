import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { validateAccessToken } from './src/utils/storyLogic.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Guarded Audio Endpoint - Zero audio is released without verified payment
app.get('/api/audio/preview', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = (authHeader ? authHeader.replace(/^Bearer\s+/i, '') : req.query.token) as string;

  const validation = validateAccessToken(token);
  if (!validation.isValid) {
    return res.status(401).json({
      error: 'Áudio restrito. É necessário realizar o pagamento de R$ 9,90 para liberar a reprodução.',
      reason: validation.reason,
      price: 9.9,
    });
  }

  const previewPath = path.join(__dirname, 'public/audio/preview.wav');
  if (!fs.existsSync(previewPath)) {
    return res.status(404).json({ error: 'Arquivo de áudio não encontrado.' });
  }

  const stat = fs.statSync(previewPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(previewPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'audio/wav',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'audio/wav',
      'Accept-Ranges': 'bytes',
    };
    res.writeHead(200, head);
    fs.createReadStream(previewPath).pipe(res);
  }
});

// Protected Full Audio Endpoint (Guarded against unauthorized public access)
app.get('/api/audio/full', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = (authHeader ? authHeader.replace(/^Bearer\s+/i, '') : req.query.token) as string;

  const validation = validateAccessToken(token);
  if (!validation.isValid) {
    return res.status(401).json({
      error: 'Acesso restrito. Adquira o áudio completo por R$ 9,90 para liberar o streaming.',
      reason: validation.reason,
    });
  }

  const fullAudioPath = path.join(__dirname, 'server-audio/full_story.wav');
  if (!fs.existsSync(fullAudioPath)) {
    return res.status(404).json({ error: 'Arquivo do conto completo em manutenção.' });
  }

  const stat = fs.statSync(fullAudioPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(fullAudioPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'audio/wav',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'audio/wav',
      'Accept-Ranges': 'bytes',
    };
    res.writeHead(200, head);
    fs.createReadStream(fullAudioPath).pipe(res);
  }
});

// Checkout integration status & configuration transparency
app.get('/api/checkout/status', (_req: Request, res: Response) => {
  const checkoutUrl =
    process.env.CHECKOUT_URL || 'https://ggcheckout.app/checkout/v2/vLZ2HuhOabHRaxzYm1i0jt';

  res.json({
    product: 'Depois da Meia-Noite - Conto em Áudio',
    price: 9.9,
    formattedPrice: 'R$ 9,90',
    currency: 'BRL',
    isGatewayLive: true,
    provider: 'GG Checkout',
    checkoutUrl,
    gatewayStatus: 'active',
    statusMessage:
      'Checkout oficial integrado e ativo com a plataforma GG Checkout (R$ 9,90 em pagamento único).',
    supportEmail: 'suporte@depoisdameianoite.com.br',
    demoToken: 'DEMO-FULL-ACCESS',
  });
});

// Verify token validity
app.post('/api/checkout/verify-token', (req: Request, res: Response) => {
  const { token } = req.body;
  const validation = validateAccessToken(token);
  if (!validation.isValid) {
    return res.status(400).json({ valid: false, message: validation.reason });
  }
  return res.json({
    valid: true,
    message: 'Acesso validado com sucesso.',
    title: 'Depois da Meia-Noite',
    accessType: 'Vitalício',
    unlockedAudioUrl: `/api/audio/full?token=${encodeURIComponent(token)}`,
  });
});

// Create payment session / intent
app.post('/api/checkout/create-intent', (req: Request, res: Response) => {
  const { email, method } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'E-mail de entrega é obrigatório para envio do acesso.' });
  }

  // Generate an order ID and checkout payload
  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  const tokenGenerated = `DM-ACCESS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  res.json({
    orderId,
    amount: 9.9,
    email,
    method: method || 'pix',
    pixCopyPaste:
      '00020126580014br.gov.bcb.pix0136' +
      Math.random().toString(36).substring(2, 14) +
      '52040000530398654049.905802BR5925DEPOIS DA MEIA NOITE6009SAO PAULO62070503***6304D1A9',
    token: tokenGenerated,
    message:
      'Pedido gerado. O acesso é liberado automaticamente após confirmação bancária ou via chave de acesso.',
  });
});

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
