# API Documentation

> **Comprehensive API documentation for Zero Voice Infinity platform**

This documentation covers all API interfaces, authentication methods, WebSocket events, and integration patterns for the Zero Voice Infinity platform.

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [REST API](#rest-api)
- [WebSocket API](#websocket-api)
- [GraphQL API](#graphql-api)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Data Models](#data-models)
- [SDKs & Libraries](#sdks--libraries)
- [Examples](#examples)
- [Changelog](#changelog)

## Overview

The Zero Voice Infinity API provides a comprehensive set of endpoints for voice AI processing, user management, analytics, and real-time communication. The API follows RESTful principles with additional support for WebSocket connections and GraphQL queries.

### Base URLs

```
Production:  https://api.zerovoiceinfinity.com/v1
Staging:     https://staging-api.zerovoiceinfinity.com/v1
Development: http://localhost:3001/v1
```

### Supported Formats

- **Request**: JSON, Form Data, Multipart (for file uploads)
- **Response**: JSON
- **WebSocket**: JSON messages
- **File Uploads**: WAV, MP3, FLAC, OGG (max 10MB)

## Authentication

### API Key Authentication

All API requests require authentication using API keys.

```http
GET /api/v1/voice/process
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

### OAuth 2.0

For user-facing applications, OAuth 2.0 flow is supported.

```http
POST /auth/oauth/token
Content-Type: application/json

{
  "grant_type": "authorization_code",
  "client_id": "your_client_id",
  "client_secret": "your_client_secret",
  "code": "authorization_code",
  "redirect_uri": "https://yourapp.com/callback"
}
```

### JWT Tokens

User sessions are managed with JWT tokens.

```typescript
interface JWTPayload {
  sub: string;          // User ID
  email: string;        // User email
  role: string;         // User role
  exp: number;          // Expiration timestamp
  iat: number;          // Issued at timestamp
  permissions: string[]; // User permissions
}
```

### Two-Factor Authentication

When 2FA is enabled, additional verification is required.

```http
POST /auth/verify-2fa
Content-Type: application/json

{
  "token": "123456",
  "backup_code": "optional_backup_code"
}
```

## REST API

### Voice Processing

#### Process Audio File

Process an audio file for voice analysis.

```http
POST /voice/process
Authorization: Bearer YOUR_API_KEY
Content-Type: multipart/form-data

{
  "audio": file,
  "language": "en-US",
  "model": "advanced",
  "options": {
    "transcription": true,
    "sentiment": true,
    "speaker_detection": true
  }
}
```

**Response:**

```json
{
  "id": "proc_12345",
  "status": "completed",
  "results": {
    "transcription": {
      "text": "Hello, this is a test.",
      "confidence": 0.98,
      "words": [
        {
          "word": "Hello",
          "start_time": 0.0,
          "end_time": 0.5,
          "confidence": 0.99
        }
      ]
    },
    "sentiment": {
      "overall": "positive",
      "score": 0.75,
      "emotions": {
        "joy": 0.8,
        "sadness": 0.1,
        "anger": 0.05,
        "fear": 0.05
      }
    },
    "speakers": [
      {
        "id": "speaker_1",
        "segments": [
          {
            "start_time": 0.0,
            "end_time": 3.5,
            "confidence": 0.95
          }
        ]
      }
    ]
  },
  "metadata": {
    "duration": 3.5,
    "sample_rate": 16000,
    "channels": 1,
    "format": "wav"
  },
  "created_at": "2024-01-24T12:00:00Z",
  "completed_at": "2024-01-24T12:00:05Z"
}
```

#### Get Processing Status

```http
GET /voice/process/{id}
Authorization: Bearer YOUR_API_KEY
```

#### List Processing Jobs

```http
GET /voice/process
Authorization: Bearer YOUR_API_KEY
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 20, max: 100)
  - status: string (pending|processing|completed|failed)
  - created_after: ISO8601 date
  - created_before: ISO8601 date
```

### User Management

#### Get User Profile

```http
GET /users/me
Authorization: Bearer JWT_TOKEN
```

**Response:**

```json
{
  "id": "user_12345",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "plan": "pro",
  "usage": {
    "api_calls_this_month": 1250,
    "api_calls_limit": 10000,
    "storage_used": "2.5GB",
    "storage_limit": "10GB"
  },
  "preferences": {
    "language": "en-US",
    "timezone": "America/New_York",
    "notifications": {
      "email": true,
      "push": false
    }
  },
  "two_factor_enabled": true,
  "created_at": "2024-01-01T00:00:00Z",
  "last_login": "2024-01-24T10:30:00Z"
}
```

#### Update User Profile

```http
PATCH /users/me
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "name": "John Smith",
  "preferences": {
    "language": "es-ES",
    "notifications": {
      "email": false
    }
  }
}
```

### API Keys

#### List API Keys

```http
GET /api-keys
Authorization: Bearer JWT_TOKEN
```

#### Create API Key

```http
POST /api-keys
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "name": "Production Key",
  "permissions": ["voice:process", "voice:read"],
  "rate_limit": {
    "requests_per_minute": 100,
    "requests_per_day": 10000
  },
  "expires_at": "2025-01-24T00:00:00Z"
}
```

#### Revoke API Key

```http
DELETE /api-keys/{key_id}
Authorization: Bearer JWT_TOKEN
```

### Analytics

#### Get Usage Analytics

```http
GET /analytics/usage
Authorization: Bearer JWT_TOKEN
Query Parameters:
  - start_date: ISO8601 date
  - end_date: ISO8601 date
  - granularity: hour|day|week|month
  - metrics: api_calls,processing_time,errors
```

**Response:**

```json
{
  "period": {
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-01-24T23:59:59Z"
  },
  "metrics": {
    "api_calls": {
      "total": 15750,
      "successful": 15200,
      "failed": 550,
      "data_points": [
        {
          "timestamp": "2024-01-01T00:00:00Z",
          "value": 245
        }
      ]
    },
    "processing_time": {
      "average": 2.3,
      "median": 1.8,
      "p95": 5.2,
      "p99": 8.7
    },
    "errors": {
      "total": 550,
      "by_type": {
        "400": 320,
        "401": 15,
        "429": 180,
        "500": 35
      }
    }
  }
}
```

## WebSocket API

### Connection

Connect to the WebSocket endpoint for real-time features.

```javascript
const ws = new WebSocket('wss://api.zerovoiceinfinity.com/ws/v1');

// Authentication after connection
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'YOUR_JWT_TOKEN'
  }));
};
```

### Message Format

All WebSocket messages follow this format:

```typescript
interface WSMessage {
  type: string;
  id?: string;          // Request ID for correlation
  timestamp: string;    // ISO8601 timestamp
  data?: any;          // Message payload
  error?: {            // Error information
    code: string;
    message: string;
    details?: any;
  };
}
```

### Events

#### Voice Processing Updates

Receive real-time updates on voice processing jobs.

```json
{
  "type": "voice.processing.update",
  "id": "proc_12345",
  "timestamp": "2024-01-24T12:00:05Z",
  "data": {
    "job_id": "proc_12345",
    "status": "processing",
    "progress": 0.65,
    "estimated_completion": "2024-01-24T12:00:10Z"
  }
}
```

#### Live Audio Streaming

Stream audio data for real-time processing.

```json
{
  "type": "audio.stream.start",
  "id": "stream_12345",
  "data": {
    "format": "pcm16",
    "sample_rate": 16000,
    "channels": 1,
    "language": "en-US"
  }
}
```

```json
{
  "type": "audio.stream.data",
  "id": "stream_12345",
  "data": {
    "audio": "base64_encoded_audio_chunk",
    "sequence": 1
  }
}
```

#### Notifications

Receive real-time notifications.

```json
{
  "type": "notification",
  "timestamp": "2024-01-24T12:00:00Z",
  "data": {
    "id": "notif_12345",
    "title": "Processing Complete",
    "message": "Your voice processing job has completed successfully.",
    "type": "success",
    "action_url": "/dashboard/jobs/proc_12345"
  }
}
```

### Error Handling

WebSocket errors follow this format:

```json
{
  "type": "error",
  "timestamp": "2024-01-24T12:00:00Z",
  "error": {
    "code": "INVALID_TOKEN",
    "message": "The provided authentication token is invalid or expired.",
    "details": {
      "token_expired": true,
      "expires_at": "2024-01-24T11:30:00Z"
    }
  }
}
```

## GraphQL API

### Endpoint

```
POST /graphql
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

### Schema Overview

```graphql
type Query {
  user: User
  voiceJobs(first: Int, after: String, status: ProcessingStatus): VoiceJobConnection
  analytics(period: AnalyticsPeriod!): Analytics
}

type Mutation {
  processVoice(input: ProcessVoiceInput!): VoiceJob
  updateUser(input: UpdateUserInput!): User
  createApiKey(input: CreateApiKeyInput!): ApiKey
}

type Subscription {
  voiceJobUpdates(jobId: ID!): VoiceJob
  notifications: Notification
}
```

### Example Queries

#### Get User with Voice Jobs

```graphql
query GetUserWithJobs {
  user {
    id
    email
    name
    voiceJobs(first: 10, status: COMPLETED) {
      edges {
        node {
          id
          status
          createdAt
          results {
            transcription {
              text
              confidence
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
```

#### Process Voice File

```graphql
mutation ProcessVoice($input: ProcessVoiceInput!) {
  processVoice(input: $input) {
    id
    status
    estimatedCompletion
  }
}
```

**Variables:**

```json
{
  "input": {
    "audioFile": "base64_encoded_audio",
    "language": "en-US",
    "options": {
      "transcription": true,
      "sentiment": true
    }
  }
}
```

## Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200  | OK | Request successful |
| 201  | Created | Resource created successfully |
| 400  | Bad Request | Invalid request parameters |
| 401  | Unauthorized | Authentication required |
| 403  | Forbidden | Insufficient permissions |
| 404  | Not Found | Resource not found |
| 409  | Conflict | Resource already exists |
| 422  | Unprocessable Entity | Validation errors |
| 429  | Too Many Requests | Rate limit exceeded |
| 500  | Internal Server Error | Server error |
| 503  | Service Unavailable | Service temporarily unavailable |

### Error Response Format

```json
{
  "error": {
    "type": "validation_error",
    "code": "INVALID_AUDIO_FORMAT",
    "message": "The uploaded audio file format is not supported.",
    "details": {
      "supported_formats": ["wav", "mp3", "flac", "ogg"],
      "received_format": "avi"
    },
    "request_id": "req_12345",
    "timestamp": "2024-01-24T12:00:00Z"
  }
}
```

### Common Error Codes

| Code | Type | Description |
|------|------|-------------|
| INVALID_API_KEY | Authentication | API key is invalid or expired |
| INSUFFICIENT_PERMISSIONS | Authorization | User lacks required permissions |
| RATE_LIMIT_EXCEEDED | Rate Limiting | Too many requests |
| INVALID_AUDIO_FORMAT | Validation | Unsupported audio format |
| FILE_TOO_LARGE | Validation | File exceeds size limit |
| QUOTA_EXCEEDED | Billing | Usage quota exceeded |
| PROCESSING_FAILED | Processing | Voice processing failed |

## Rate Limiting

### Limits

| Plan | Requests/Minute | Requests/Day | Concurrent Jobs |
|------|----------------|--------------|----------------|
| Free | 10 | 1,000 | 1 |
| Pro | 100 | 10,000 | 5 |
| Enterprise | 1,000 | 100,000 | 20 |

### Headers

Rate limit information is included in response headers:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1706097600
X-RateLimit-Window: 60
```

### Rate Limit Response

When rate limit is exceeded:

```json
{
  "error": {
    "type": "rate_limit_error",
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 30 seconds.",
    "details": {
      "limit": 100,
      "window": 60,
      "retry_after": 30
    }
  }
}
```

## Data Models

### Voice Job

```typescript
interface VoiceJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  user_id: string;
  audio_metadata: {
    duration: number;
    sample_rate: number;
    channels: number;
    format: string;
    size: number;
  };
  options: {
    transcription: boolean;
    sentiment: boolean;
    speaker_detection: boolean;
    language: string;
    model: string;
  };
  results?: {
    transcription?: TranscriptionResult;
    sentiment?: SentimentResult;
    speakers?: SpeakerResult[];
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  created_at: string;
  started_at?: string;
  completed_at?: string;
  expires_at: string;
}
```

### Transcription Result

```typescript
interface TranscriptionResult {
  text: string;
  confidence: number;
  language: string;
  words: Array<{
    word: string;
    start_time: number;
    end_time: number;
    confidence: number;
  }>;
  segments: Array<{
    text: string;
    start_time: number;
    end_time: number;
    confidence: number;
  }>;
}
```

### User

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'enterprise';
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'pending';
  usage: {
    api_calls_this_month: number;
    api_calls_limit: number;
    storage_used: string;
    storage_limit: string;
    processing_minutes_used: number;
    processing_minutes_limit: number;
  };
  preferences: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}
```

## SDKs & Libraries

### JavaScript/TypeScript SDK

```bash
npm install @zerovoiceinfinity/sdk
```

```typescript
import { ZeroVoiceInfinity } from '@zerovoiceinfinity/sdk';

const client = new ZeroVoiceInfinity({
  apiKey: 'your_api_key',
  environment: 'production' // or 'staging', 'development'
});

// Process audio file
const job = await client.voice.process({
  audio: audioFile,
  language: 'en-US',
  options: {
    transcription: true,
    sentiment: true
  }
});

// Get results
const results = await client.voice.getResults(job.id);
```

### Python SDK

```bash
pip install zerovoiceinfinity
```

```python
from zerovoiceinfinity import ZeroVoiceInfinity

client = ZeroVoiceInfinity(api_key='your_api_key')

# Process audio file
job = client.voice.process(
    audio_file='path/to/audio.wav',
    language='en-US',
    options={
        'transcription': True,
        'sentiment': True
    }
)

# Get results
results = client.voice.get_results(job.id)
```

### cURL Examples

```bash
# Process audio file
curl -X POST https://api.zerovoiceinfinity.com/v1/voice/process \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F "audio=@audio.wav" \
  -F "language=en-US" \
  -F "options[transcription]=true"

# Get processing status
curl -X GET https://api.zerovoiceinfinity.com/v1/voice/process/proc_12345 \
  -H "Authorization: Bearer YOUR_API_KEY"

# Get user profile
curl -X GET https://api.zerovoiceinfinity.com/v1/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Examples

### Real-time Voice Processing

```typescript
import { ZeroVoiceInfinity } from '@zerovoiceinfinity/sdk';

const client = new ZeroVoiceInfinity({
  apiKey: 'your_api_key'
});

// Start real-time processing
const stream = client.voice.createStream({
  language: 'en-US',
  format: 'pcm16',
  sampleRate: 16000
});

// Handle results
stream.on('transcription', (result) => {
  console.log('Transcription:', result.text);
});

stream.on('sentiment', (result) => {
  console.log('Sentiment:', result.overall);
});

// Send audio data
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(mediaStream => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(mediaStream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    
    processor.onaudioprocess = (e) => {
      const audioData = e.inputBuffer.getChannelData(0);
      stream.send(audioData);
    };
    
    source.connect(processor);
    processor.connect(audioContext.destination);
  });
```

### Batch Processing

```typescript
// Process multiple files
const files = ['audio1.wav', 'audio2.wav', 'audio3.wav'];
const jobs = await Promise.all(
  files.map(file => 
    client.voice.process({
      audio: file,
      language: 'en-US',
      options: { transcription: true }
    })
  )
);

// Wait for all jobs to complete
const results = await Promise.all(
  jobs.map(job => client.voice.waitForCompletion(job.id))
);

console.log('All processing complete:', results);
```

### Webhook Integration

```typescript
// Set up webhook endpoint
app.post('/webhooks/voice-processing', (req, res) => {
  const { job_id, status, results } = req.body;
  
  if (status === 'completed') {
    console.log('Job completed:', job_id);
    console.log('Transcription:', results.transcription.text);
    
    // Process results
    processTranscriptionResults(results);
  } else if (status === 'failed') {
    console.error('Job failed:', job_id, results.error);
  }
  
  res.status(200).send('OK');
});
```

## Changelog

### v1.3.0 (2024-01-24)
- Added GraphQL API support
- Enhanced WebSocket real-time features
- Improved error handling and response format
- Added bulk processing endpoints
- Enhanced analytics with more granular metrics

### v1.2.0 (2024-01-15)
- Added speaker detection capabilities
- Improved sentiment analysis accuracy
- Added support for more audio formats
- Enhanced rate limiting with per-user limits
- Added webhook support for async processing

### v1.1.0 (2024-01-01)
- Added real-time audio streaming
- Enhanced transcription with word-level timestamps
- Added multi-language support
- Improved API key management
- Added usage analytics dashboard

### v1.0.0 (2023-12-01)
- Initial API release
- Basic voice processing capabilities
- User management and authentication
- API key-based access control
- RESTful endpoints for core functionality

---

## Support

For API support and questions:

- **Documentation**: [https://docs.zerovoiceinfinity.com](https://docs.zerovoiceinfinity.com)
- **Support Email**: [api-support@zerovoiceinfinity.com](mailto:api-support@zerovoiceinfinity.com)
- **Discord Community**: [https://discord.gg/zerovoiceinfinity](https://discord.gg/zerovoiceinfinity)
- **Status Page**: [https://status.zerovoiceinfinity.com](https://status.zerovoiceinfinity.com)

---

**Last Updated**: January 24, 2025  
**API Version**: v1.3.0 