# Lawvanta API Documentation

Base URL: `http://localhost:5000/api` (development)

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "metadata": {
    "timestamp": "2026-05-04T10:30:00Z",
    "requestId": "uuid"
  }
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  },
  "metadata": {
    "timestamp": "2026-05-04T10:30:00Z",
    "requestId": "uuid"
  }
}
```

## Endpoints

### Authentication

#### POST /auth/register

Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "John Doe",
  "role": "JUDGE|LAWYER|CLERK|PROSECUTOR|LITIGANT",
  "phone": "+91-9876543210",
  "barCouncilId": "BAR/DLH/2015/12345",
  "courtId": "DLH-HC-001"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "JUDGE",
      "preferences": { ... }
    },
    "token": "jwt-token"
  }
}
```

#### POST /auth/login

Authenticate a user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt-token"
  }
}
```

#### POST /auth/logout

Logout current user (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

#### POST /auth/refresh

Refresh JWT token.

**Request Body:**
```json
{
  "token": "old-jwt-token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new-jwt-token"
  }
}
```

#### GET /auth/me

Get current user information (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "JUDGE",
    "preferences": {
      "language": "en",
      "theme": "light",
      "agentTone": "conversational"
    }
  }
}
```

### Cases

#### GET /cases

Get list of cases (requires authentication).

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `pageSize` (number): Items per page (default: 20)
- `status` (string): Filter by status
- `caseType` (string): Filter by case type

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "caseNumber": "CS/2024/001",
        "caseType": "CIVIL",
        "status": "PENDING",
        "title": "Ram Kumar vs. State Bank of India",
        "filingDate": "2024-01-15",
        "nextHearingDate": "2024-06-15"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}
```

#### POST /cases

Create a new case (requires authentication).

**Request Body:**
```json
{
  "caseNumber": "CS/2024/001",
  "caseType": "CIVIL",
  "title": "Case Title",
  "description": "Case description",
  "filingDate": "2024-01-15",
  "parties": [
    {
      "name": "Party Name",
      "type": "PETITIONER",
      "lawyerId": "uuid"
    }
  ]
}
```

#### GET /cases/:id

Get case details (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "caseNumber": "CS/2024/001",
    "caseType": "CIVIL",
    "status": "PENDING",
    "title": "Case Title",
    "description": "Description",
    "parties": [ ... ],
    "documents": [ ... ],
    "timeline": [ ... ]
  }
}
```

### Documents

#### POST /documents/upload

Upload a document (requires authentication).

**Request:**
- Content-Type: `multipart/form-data`
- Fields:
  - `file`: Document file (PDF, DOCX)
  - `caseId`: Associated case ID
  - `title`: Document title
  - `type`: Document type

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Document Title",
    "fileUrl": "https://...",
    "uploadedAt": "2024-05-04T10:30:00Z"
  }
}
```

#### POST /documents/:id/analyze

Analyze a document with AI (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "Document summary...",
    "keyPoints": [
      "Key point 1",
      "Key point 2"
    ],
    "suggestedCitations": [
      "IPC Section 302",
      "AIR 2020 SC 1234"
    ],
    "extractedEntities": {
      "persons": ["Name 1", "Name 2"],
      "dates": ["2024-01-15"],
      "locations": ["Delhi"],
      "laws": ["IPC Section 302"]
    },
    "confidence": 0.85
  }
}
```

### Chat

#### GET /chat/conversations

Get user's conversations (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Conversation Title",
      "agentType": "JUSTICE_AI",
      "messageCount": 10,
      "createdAt": "2024-05-04T10:00:00Z",
      "updatedAt": "2024-05-04T10:30:00Z"
    }
  ]
}
```

#### POST /chat/conversations

Create a new conversation (requires authentication).

**Request Body:**
```json
{
  "title": "New Conversation"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "New Conversation",
    "agentType": "JUSTICE_AI",
    "messages": []
  }
}
```

#### GET /chat/conversations/:id

Get conversation with messages (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Conversation Title",
    "agentType": "JUSTICE_AI",
    "messages": [
      {
        "id": "uuid",
        "role": "USER",
        "content": "User message",
        "createdAt": "2024-05-04T10:00:00Z"
      },
      {
        "id": "uuid",
        "role": "ASSISTANT",
        "content": "AI response",
        "metadata": {
          "sources": ["Source 1"],
          "confidence": 0.9
        },
        "createdAt": "2024-05-04T10:00:05Z"
      }
    ]
  }
}
```

#### POST /chat/conversations/:id/messages

Send a message in conversation (requires authentication).

**Request Body:**
```json
{
  "content": "User message text"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userMessage": {
      "id": "uuid",
      "role": "USER",
      "content": "User message",
      "createdAt": "2024-05-04T10:00:00Z"
    },
    "aiMessage": {
      "id": "uuid",
      "role": "ASSISTANT",
      "content": "AI response",
      "metadata": {
        "sources": ["IPC Section 302", "AIR 2020 SC 1234"],
        "confidence": 0.9
      },
      "createdAt": "2024-05-04T10:00:05Z"
    }
  }
}
```

#### DELETE /chat/conversations/:id

Delete a conversation (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Conversation deleted successfully"
  }
}
```

### Orders

#### GET /orders/templates

Get order templates (requires authentication).

**Query Parameters:**
- `category` (string): Filter by category
- `caseType` (string): Filter by applicable case type

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Bail Order",
      "category": "Criminal",
      "template": "Template text with [VARIABLES]",
      "variables": ["CASE_NUMBER", "ACCUSED_NAME"],
      "applicableFor": ["CRIMINAL"]
    }
  ]
}
```

#### POST /orders/generate

Generate an order using AI (requires authentication).

**Request Body:**
```json
{
  "orderType": "Bail Order",
  "caseId": "uuid",
  "templateId": "uuid",
  "variables": {
    "CASE_NUMBER": "CR/2024/045",
    "ACCUSED_NAME": "John Doe"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "content": "Generated order text...",
    "metadata": {
      "generatedAt": "2024-05-04T10:30:00Z",
      "model": "gpt-4-turbo-preview"
    }
  }
}
```

### Analytics

#### GET /analytics

Get user analytics (requires authentication).

**Query Parameters:**
- `period` (string): DAY|WEEK|MONTH|YEAR

**Response:**
```json
{
  "success": true,
  "data": {
    "metrics": {
      "casesHandled": 45,
      "ordersGenerated": 23,
      "documentsProcessed": 67,
      "aiInteractions": 234,
      "averageResponseTime": 15.5
    },
    "trends": {
      "caseTypes": {
        "CIVIL": 20,
        "CRIMINAL": 15,
        "WRIT": 10
      },
      "busyHours": [9, 10, 11, 14, 15, 16]
    }
  }
}
```

## WebSocket Events

Connect to WebSocket server at `ws://localhost:5000`

### Authentication

Send authentication token on connection:

```javascript
const socket = io('ws://localhost:5000', {
  auth: {
    token: 'jwt-token'
  }
});
```

### Events

#### Client → Server

**chat:stream**
Request streaming AI response.

```javascript
socket.emit('chat:stream', {
  conversationId: 'uuid',
  message: 'User message'
});
```

**chat:typing**
Send typing indicator.

```javascript
socket.emit('chat:typing', {
  conversationId: 'uuid',
  isTyping: true
});
```

#### Server → Client

**chat:message**
Receive new chat message.

```javascript
socket.on('chat:message', (data) => {
  console.log(data.message);
});
```

**chat:typing**
Receive typing indicator.

```javascript
socket.on('chat:typing', (data) => {
  console.log(`User ${data.userId} is typing: ${data.isTyping}`);
});
```

**notification**
Receive notification.

```javascript
socket.on('notification', (data) => {
  console.log(data.title, data.message);
});
```

## Error Codes

| Code | Description |
|------|-------------|
| `AUTHENTICATION_ERROR` | Invalid or missing authentication |
| `AUTHORIZATION_ERROR` | Insufficient permissions |
| `VALIDATION_ERROR` | Invalid request data |
| `NOT_FOUND` | Resource not found |
| `CONFLICT` | Resource already exists |
| `INTERNAL_ERROR` | Server error |
| `RATE_LIMIT_EXCEEDED` | Too many requests |

## Rate Limiting

- **Default**: 100 requests per 15 minutes per IP
- **Authenticated**: 1000 requests per 15 minutes per user
- **AI Endpoints**: 20 requests per minute per user

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1620000000
```

## Pagination

Paginated endpoints support:

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `pageSize` (number): Items per page (default: 20, max: 100)

**Response:**
```json
{
  "items": [ ... ],
  "total": 100,
  "page": 1,
  "pageSize": 20,
  "totalPages": 5
}
```

## Filtering & Sorting

**Query Parameters:**
- `filter[field]`: Filter by field value
- `sort`: Sort field (prefix with `-` for descending)

Example:
```
GET /cases?filter[status]=PENDING&sort=-filingDate
```

## Best Practices

1. **Always use HTTPS** in production
2. **Store tokens securely** (httpOnly cookies or secure storage)
3. **Implement token refresh** before expiration
4. **Handle rate limits** gracefully
5. **Validate input** on client side
6. **Handle errors** appropriately
7. **Use pagination** for large datasets
8. **Implement retry logic** for failed requests
9. **Log API calls** for debugging
10. **Monitor API usage** and performance

## SDK Examples

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
const { data } = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password'
});

// Send chat message
const response = await api.post(
  `/chat/conversations/${conversationId}/messages`,
  { content: 'Hello AI' }
);
```

### Python

```python
import requests

class LawvantaAPI:
    def __init__(self, base_url, token=None):
        self.base_url = base_url
        self.token = token
        
    def login(self, email, password):
        response = requests.post(
            f'{self.base_url}/auth/login',
            json={'email': email, 'password': password}
        )
        data = response.json()
        self.token = data['data']['token']
        return data
        
    def send_message(self, conversation_id, content):
        headers = {'Authorization': f'Bearer {self.token}'}
        response = requests.post(
            f'{self.base_url}/chat/conversations/{conversation_id}/messages',
            json={'content': content},
            headers=headers
        )
        return response.json()

# Usage
api = LawvantaAPI('http://localhost:5000/api')
api.login('user@example.com', 'password')
result = api.send_message('conv-id', 'Hello AI')
```

## Support

For API support:
- 📧 Email: api@lawvanta.com
- 📚 Docs: https://docs.lawvanta.com/api
- 💬 Discord: https://discord.gg/lawvanta
