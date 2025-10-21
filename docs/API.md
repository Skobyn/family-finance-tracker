# Family Finance Tracker API Documentation

## Overview

This document describes the available API endpoints for the Family Finance Tracker application, including authentication requirements, request/response formats, and rate limiting policies.

## Rate Limiting

All API endpoints are protected by IP-based rate limiting to prevent abuse and ensure fair resource allocation. When rate limits are exceeded, the API returns a `429 Too Many Requests` status with retry information.

### Rate Limit Tiers

The application implements three tiers of rate limiting:

#### Standard Rate Limit

- **Limit**: 100 requests per 15 minutes
- **Applied to**: Mutation endpoints (POST, PUT, DELETE)
- **Use case**: General API operations that modify data

#### Lenient Rate Limit

- **Limit**: 200 requests per 15 minutes
- **Applied to**: Read-heavy endpoints (GET)
- **Use case**: Data fetching and retrieval operations

#### Strict Rate Limit

- **Limit**: 10 requests per 15 minutes
- **Applied to**: Authentication endpoints
- **Use case**: Sensitive operations (login, password reset, etc.)

### Rate Limit Headers

When a rate limit is exceeded, the API returns the following headers:

```
HTTP/1.1 429 Too Many Requests
Retry-After: <seconds>
X-RateLimit-Limit: <max requests>
X-RateLimit-Remaining: 0
X-RateLimit-Reset: <ISO 8601 timestamp>
```

### Rate Limit Response Format

```json
{
  "error": "Too many requests, please try again later.",
  "retryAfter": 300
}
```

## Authentication

All API endpoints require Firebase authentication. Requests must include valid Firebase authentication tokens in the request headers or cookies.

**Unauthorized Response:**

```json
{
  "error": "Unauthorized"
}
```

**Status Code:** `401`

---

## Plaid Integration Endpoints

### 1. Create Link Token

Creates a Plaid Link token for initiating the bank connection flow.

**Endpoint:** `POST /api/plaid/create-link-token`

**Rate Limit:** Standard (100 requests per 15 minutes)

**Authentication:** Required

**Request Body:** None

**Success Response:**

```json
{
  "linkToken": "link-sandbox-12345678-abcd-1234-efgh-123456789012"
}
```

**Status Code:** `200`

**Error Responses:**

```json
{
  "error": "Unauthorized"
}
```

**Status Code:** `401`

```json
{
  "error": "Failed to create link token",
  "details": "<error message>"
}
```

**Status Code:** `500`

**Description:**

- Generates a unique Plaid Link token for the authenticated user
- Token is used to initialize the Plaid Link UI component
- Includes OAuth redirect URI for bank authentication flows
- Enables Transactions and Auth products

---

### 2. Exchange Public Token

Exchanges a Plaid public token for an access token and stores it securely.

**Endpoint:** `POST /api/plaid/exchange-public-token`

**Rate Limit:** Standard (100 requests per 15 minutes)

**Authentication:** Required

**Request Body:**

```json
{
  "publicToken": "public-sandbox-12345678-abcd-1234-efgh-123456789012",
  "institution": {
    "name": "Chase Bank"
  }
}
```

**Success Response:**

```json
{
  "success": true,
  "message": "Account successfully linked",
  "itemId": "item-sandbox-12345678-abcd-1234-efgh-123456789012"
}
```

**Status Code:** `200`

**Error Responses:**

```json
{
  "error": "Unauthorized"
}
```

**Status Code:** `401`

```json
{
  "error": "Missing public token"
}
```

**Status Code:** `400`

```json
{
  "error": "Failed to exchange token",
  "details": "<error message>"
}
```

**Status Code:** `500`

**Description:**

- Exchanges the one-time public token received from Plaid Link
- Stores the permanent access token in Firestore
- Associates the token with the authenticated user's account
- Returns the Plaid item ID for future transaction requests

---

### 3. Get Transactions

Fetches transaction data from Plaid for a linked bank account.

**Endpoint:** `POST /api/plaid/get-transactions`

**Rate Limit:** Lenient (200 requests per 15 minutes)

**Authentication:** Required

**Request Body:**

```json
{
  "itemId": "item-sandbox-12345678-abcd-1234-efgh-123456789012",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31"
}
```

**Fields:**

- `itemId` (required): Plaid item ID from exchange-public-token response
- `startDate` (optional): Start date in YYYY-MM-DD format (defaults to 30 days ago)
- `endDate` (optional): End date in YYYY-MM-DD format (defaults to today)

**Success Response:**

```json
{
  "success": true,
  "transactions": [
    {
      "transaction_id": "txn_12345",
      "account_id": "acc_12345",
      "amount": 12.5,
      "date": "2024-01-15",
      "name": "Coffee Shop",
      "merchant_name": "Starbucks",
      "category": ["Food and Drink", "Restaurants"],
      "pending": false
    }
  ],
  "accounts": [
    {
      "account_id": "acc_12345",
      "name": "Checking Account",
      "official_name": "Chase Total Checking",
      "type": "depository",
      "subtype": "checking",
      "balances": {
        "current": 1250.0,
        "available": 1200.0
      }
    }
  ]
}
```

**Status Code:** `200`

**Error Responses:**

```json
{
  "error": "Unauthorized"
}
```

**Status Code:** `401`

```json
{
  "error": "Missing Plaid item ID"
}
```

**Status Code:** `400`

```json
{
  "error": "Access token not found for this item"
}
```

**Status Code:** `404`

```json
{
  "error": "Failed to fetch transactions",
  "details": "<error message>"
}
```

**Status Code:** `500`

**Description:**

- Retrieves transaction data for the specified date range
- Automatically stores transactions in Firestore for the authenticated user
- Returns both transaction and account information
- Uses the stored access token associated with the itemId

---

### 4. OAuth Redirect

Handles OAuth redirects from Plaid after bank authentication.

**Endpoint:** `GET /api/plaid/oauth-redirect`

**Rate Limit:** Standard (100 requests per 15 minutes)

**Authentication:** Not required (public endpoint)

**Query Parameters:**

- `oauth_state_id` (required): OAuth state identifier from Plaid

**Success Response:**

- Redirects to: `/connect-bank?oauth_state_id=<state_id>`

**Error Response:**

```json
{
  "error": "Missing oauth_state_id parameter"
}
```

**Status Code:** `400`

```json
{
  "error": "Failed to process OAuth redirect",
  "details": "<error message>"
}
```

**Status Code:** `500`

**Description:**

- Receives OAuth callback from Plaid after user completes bank authentication
- Extracts the oauth_state_id parameter
- Redirects to the client-side route to resume the Plaid Link flow
- Must match the redirect URI configured in Plaid dashboard

---

## Error Handling

### Common Error Codes

| Status Code | Description                                          |
| ----------- | ---------------------------------------------------- |
| `400`       | Bad Request - Invalid or missing required parameters |
| `401`       | Unauthorized - Authentication required or failed     |
| `404`       | Not Found - Resource does not exist                  |
| `429`       | Too Many Requests - Rate limit exceeded              |
| `500`       | Internal Server Error - Server-side error occurred   |

### Error Response Format

All error responses follow this format:

```json
{
  "error": "<error message>",
  "details": "<optional detailed error information>"
}
```

---

## Best Practices

### Rate Limiting

1. **Monitor Headers**: Check `X-RateLimit-Remaining` header to track available requests
2. **Implement Backoff**: When receiving `429` responses, respect the `Retry-After` header
3. **Cache Data**: Cache transaction data client-side to reduce API calls
4. **Batch Requests**: Group multiple operations when possible

### Security

1. **Never Share Tokens**: Do not expose access tokens or link tokens in client-side code
2. **Use HTTPS**: All API requests must use HTTPS in production
3. **Validate Input**: Sanitize all user input before sending to API
4. **Handle Errors**: Implement proper error handling for all API responses

### Performance

1. **Optimize Date Ranges**: Request only the data you need with appropriate date ranges
2. **Reuse Link Tokens**: Link tokens are valid for 30 minutes - reuse when possible
3. **Handle Pending Transactions**: Account for pending transactions in your UI
4. **Monitor Limits**: Track your API usage to stay within rate limits

---

## Development vs Production

### Development

- Rate limiting is relaxed for localhost (`127.0.0.1`, `::1`)
- Detailed error messages included in responses
- Uses Plaid Sandbox environment

### Production

- Strict rate limiting enforced for all IPs
- Error messages sanitized to prevent information leakage
- Uses Plaid Production environment
- Consider implementing Redis-based rate limiting for horizontal scaling

---

## Support

For issues or questions:

1. Check the error message and status code
2. Verify authentication and rate limits
3. Review Plaid API documentation: https://plaid.com/docs/
4. Check Firebase authentication status

---

**Last Updated:** 2025-10-21
**API Version:** 1.0
**Plaid API Version:** 2020-09-14
