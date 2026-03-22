# INF653-Homework9-Secure-Oil-Price

## Securing the Energy API with Express.js Middleware
### Objective
This assignment focuses on the practical application of Express.js middleware to secure and manage an API. You will build a multi-layered middleware stack to handle traffic control, IP security, and dual-mode authentication.

### 1. Project Specifications
#### Backend Requirements
You are required to build an Express.js server that implements the following middleware layers in the correct order:
- **IP Filtering**: Create a custom middleware that only allows requests from `127.0.0.1` or `::1`. Block all other IPs with a `403 Forbidden` status.
- **CORS**: Use the `cors` package to restrict access only to your current local development origin.
- **Rate Limiting**: Implement a limit of 10 requests per 1 minute. Use `express-rate-limit`.
- **Bearer Token Authentication**: Protect the API data endpoint. Require a header: `Authorization: Bearer <your_secret_token>`.

## Setup
Install dependencies and run the server:

```bash
npm install
npm start
```

Server URL:

```text
http://localhost:3000
```

### Bearer Token
```text
inf653-secure-token-2026
```

Use header:
```text
Authorization: Bearer inf653-secure-token-2026
```

### Basic Auth for `/dashboard`
- Username: `admin`
- Password: `password123`

## Endpoints

### GET `/api/oil-prices` (Bearer Token)
Returns the static oil price JSON object.

### GET `/dashboard` (Basic Auth)
Returns an HTML dashboard table of oil prices.

### GET `/logout` (No auth)
Shows a "Logged Out Successfully" page with a link to log in again.

## Quick Test Commands

### Valid API request
```bash
curl -i http://localhost:3000/api/oil-prices \
  -H "Authorization: Bearer inf653-secure-token-2026"
```
Expected: `200 OK` + JSON data.

### Missing token
```bash
curl -i http://localhost:3000/api/oil-prices
```
Expected: `401 Unauthorized`.

### Wrong token
```bash
curl -i http://localhost:3000/api/oil-prices \
  -H "Authorization: Bearer wrongtoken"
```
Expected: `401 Unauthorized`.

### Dashboard test
```bash
curl -i http://localhost:3000/dashboard -u admin:password123
```
Expected: `200 OK` + HTML page.

## Static Data Returned by the API
```json
{
  "market": "Global Energy Exchange",
  "last_updated": "2026-03-15T12:55:00Z",
  "currency": "USD",
  "data": [
    {
      "symbol": "WTI",
      "name": "West Texas Intermediate",
      "price": 78.45,
      "change": 0.12
    },
    {
      "symbol": "BRENT",
      "name": "Brent Crude",
      "price": 82.30,
      "change": -0.05
    },
    {
      "symbol": "NAT_GAS",
      "name": "Natural Gas",
      "price": 2.15,
      "change": 0.02
    }
  ]
}
```