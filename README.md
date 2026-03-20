# INF653-Homework9-Secure-Oil-Price

## Securing the Energy API with Express.js Middleware
### Objective
This assignment focuses on the practical application of Express.js middleware to secure and manage an API. You will build a multi-layered middleware stack to handle traffic control, IP security, and dual-mode authentication.

### 1. Project Specifications
#### Backend Requirements
You are required to build an Express.js server that implements the following middleware layers in the correct order:
- IP Filtering: Create a custom middleware that only allows requests from `127.0.0.1` or `::1`. Block all other IPs with a `403 Forbidden` status.
- CORS: Use the `cors` package to restrict access only to your current local development origin.
- Rate Limiting: Implement a limit of 10 requests per 1 minute. Use `express-rate-limit`.
- Bearer Token Authentication: Protect the API data endpoint. Require a header: `Authorization: Bearer <your_secret_token>`.

#### The Data (Static Oil Price Object)
Your API must return the following JSON object when called successfully:
```
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

### 2. Endpoint Definitions
Method	  Endpoint	          Protection	    Description
GET      `/api/oil-prices`    Bearer Token    Returns the JSON oil price object.
GET      `/dashboard`         Basic Auth      Serves a simple HTML page (UI) showing the prices.
GET      `/logout`            None            Clears the Basic Auth session and redirects to a "Logged Out" message.

### 3. Submission Guidelines
1. Repository: Create a public GitHub repository named `express-middleware-assignment`.
2. Code Structure: * `app.js` (or `server.js`): Main application logic.
   - `package.json`: Listing all dependencies.
   - `README.md`: Instructions to run the project.
3. README Requirements:
   - State the Bearer Token value needed for testing.
   - State the Username/Password for the `/dashboard` Basic Auth.
4. Submission: Paste the URL of your GitHub repository into the Canvas assignment text box.

### 4. Evaluation Criteria (Rubric)
- Middleware Order (25%): Are layers (IP, CORS, Rate Limit, Auth) applied in a logical sequence?
- Security (25%): Does the Bearer Token and Basic Auth correctly block unauthorized access?
- Traffic Control (25%): Is the Rate Limiter functional and set to the correct parameters?
- Code Quality (25%): Is the code clean, commented, and does the `/logout` logic work as intended?
