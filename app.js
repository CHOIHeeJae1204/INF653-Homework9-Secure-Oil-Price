const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const basicAuth = require('express-basic-auth');

const app = express();
const PORT = process.env.PORT || 3000;

const ALLOWED_ORIGIN = 'http://localhost:3000';

const BEARER_TOKEN = 'inf653-secure-token-2026';

const oilPrices = {
  market: 'Global Energy Exchange',
  last_updated: '2026-03-15T12:55:00Z',
  currency: 'USD',
  data: [
    {
      symbol: 'WTI',
      name: 'West Texas Intermediate',
      price: 78.45,
      change: 0.12
    },
    {
      symbol: 'BRENT',
      name: 'Brent Crude',
      price: 82.30,
      change: -0.05
    },
    {
      symbol: 'NAT_GAS',
      name: 'Natural Gas',
      price: 2.15,
      change: 0.02
    }
  ]
};

// IP filtering — only allow localhost
function ipFilter(req, res, next) {
  const allowedIps = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];
  const clientIp = req.ip || req.socket.remoteAddress;

  if (allowedIps.includes(clientIp)) {
    return next();
  }

  return res.status(403).json({
    error: 'Forbidden: Only localhost can access this server'
  });
}

// CORS — restrict to local origin
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || origin === ALLOWED_ORIGIN) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  }
};

// Rate limiter — 10 requests per minute
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please try again after 1 minute.'
  }
});

// Bearer token auth for /api/oil-prices
function verifyBearerToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized: Missing or malformed Authorization header'
    });
  }

  const token = authHeader.split(' ')[1];

  if (token !== BEARER_TOKEN) {
    return res.status(401).json({
      error: 'Unauthorized: Invalid bearer token'
    });
  }

  next();
}

// global middleware order: IP filter -> CORS -> rate limit
app.use(ipFilter);
app.use(cors(corsOptions));
app.use(limiter);

// Basic Auth for /dashboard
const dashboardAuth = basicAuth({
  users: {
    admin: 'password123'
  },
  challenge: true,
  realm: 'EnergyDashboard',
  unauthorizedResponse: 'Unauthorized'
});

app.get('/', (req, res) => {
  res.send(`
    <h1>Securing Energy API</h1>
    <p>Available routes:</p>
    <ul>
      <li>GET /api/oil-prices — Bearer Token required</li>
      <li>GET /dashboard — Basic Auth required</li>
      <li>GET /logout — clears Basic Auth session</li>
    </ul>
  `);
});

app.get('/api/oil-prices', verifyBearerToken, (req, res) => {
  res.json(oilPrices);
});

app.get('/dashboard', dashboardAuth, (req, res) => {
  const rows = oilPrices.data.map(item => `
    <tr>
      <td>${item.symbol}</td>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>${item.change}</td>
    </tr>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Oil Prices Dashboard</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            background-color: #f4f4f4;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }
          th {
            background-color: #658dc1;
            color: white;
          }
          a {
            display: inline-block;
            margin-top: 20px;
            text-decoration: none;
            color: white;
            background: #c0392b;
            padding: 10px 16px;
            border-radius: 6px;
          }
        </style>
      </head>
      <body>
          <h1>${oilPrices.market}</h1>
          <p><strong>Last Updated:</strong> ${oilPrices.last_updated}</p>
          <p><strong>Currency:</strong> ${oilPrices.currency}</p>

          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Price</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>

          <a href="/logout">Logout</a>
      </body>
    </html>
  `);
});

// show a logout success page without triggering another browser auth popup
app.get('/logout', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Logged Out</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .box {
            text-align: center;
            background: white;
            padding: 60px 80px;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }
          h1 {
            margin-top: 0;
            margin-bottom: 24px;
          }
          a {
            display: inline-block;
            text-decoration: none;
            color: white;
            background: #1a73e8;
            padding: 10px 20px;
            border-radius: 6px;
            font-size: 15px;
          }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>Logged Out Successfully</h1>
          <a href="/dashboard">Login Again</a>
        </div>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});