## 📡 API Endpoints

### 1. Survey Management

#### Submit Survey
```http
POST /api/surveys
Content-Type: application/json
x-internal-api-key: [required for external access]

{
  "customerEmail": "customer@example.com",
  "photos": [
    {
      "photoType": "meter_closeup",
      "s3Key": "survey/tmp/uuid_meter_closeup.jpg",
      "validation": {
        "isValid": true,
        "confidence": 0.95,
        "feedback": "Clear meter reading visible",
        "extractedData": {
          "amperage": 200
        }
      }
    }
  ],
  "skippedSteps": ["ac_unit_label"],
  "mainDisconnectAmperage": 200,
  "geolocation": "40.7128,-74.0060",
  "notes": "Customer notes about installation"
}
```

**Response (201 Created):**
```json
{
  "surveyId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Survey submitted successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields or invalid email format
- `401 Unauthorized`: Invalid or missing API key
- `500 Internal Server Error`: Database or S3 errors

#### Retrieve Surveys
```http
GET /api/surveys?email=customer@example.com
x-internal-api-key: [required]
```

**Response (200 OK):**
```json
{
  "surveys": [
    {
      "survey_id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "customer@example.com",
      "name": null,
      "phone_number": null,
      "start_timestamp": "2024-01-01T10:00:00.000Z",
      "completion_timestamp": "2024-01-01T10:30:00.000Z",
      "main_disconnect_amperage": 200,
      "status": "completed",
      "geolocation": "40.7128,-74.0060",
      "notes": "Customer notes",
      "validation_results": null,
      "photos": [
        {
          "photo_id": "660e8400-e29b-41d4-a716-446655440001",
          "s3_key": "survey/tmp/uuid_meter_closeup.jpg",
          "s3_url": "https://bucket.s3.region.amazonaws.com/survey/tmp/uuid_meter_closeup.jpg",
          "photo_type": "meter_closeup",
          "capture_timestamp": "2024-01-01T10:15:00.000Z",
          "geolocation": null,
          "validation_json": {
            "isValid": true,
            "confidence": 0.95,
            "feedback": "Clear meter reading visible",
            "extractedData": {
              "amperage": 200
            }
          },
          "metadata": null,
          "presignedUrl": "https://bucket.s3.region.amazonaws.com/survey/tmp/uuid_meter_closeup.jpg?X-Amz-Signature=...",
          "urlExpiresIn": 3600
        }
      ]
    }
  ]
}
```

**Error Responses:**
- `400 Bad Request`: Missing email parameter
- `401 Unauthorized`: Invalid or missing API key
- `500 Internal Server Error`: Database errors

### 2. Photo Upload

#### Get Presigned Upload URLs
```http
POST /api/surveys/photos
Content-Type: application/json
x-internal-api-key: [required for external access]

{
  "photos": [
    { "photoType": "meter_closeup" },
    { "photoType": "panel_main" },
    { "photoType": "breaker_box_interior" }
  ]
}
```

**Response (200 OK):**
```json
{
  "urls": [
    {
      "photoType": "meter_closeup",
      "key": "survey/tmp/d9bf1572-2895-43f8-9f75-14dae75b9ce1_meter_closeup.jpg",
      "uploadUrl": "https://bucket.s3.region.amazonaws.com/survey/tmp/d9bf1572-2895-43f8-9f75-14dae75b9ce1_meter_closeup.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&..."
    }
  ]
}
```

**Usage Flow:**
1. Call this endpoint to get presigned URLs
2. Upload files directly to S3 using the returned `uploadUrl`
3. Submit survey using the returned `key` values

**Error Responses:**
- `400 Bad Request`: Invalid photos array or missing photoType
- `401 Unauthorized`: Invalid or missing API key
- `500 Internal Server Error`: S3 presigning errors

#### Upload Photo to S3
```http
PUT {uploadUrl from previous step}
Content-Type: image/jpeg

[Raw image file binary data]
```

**Response (200 OK):** Empty body with ETag header

### 3. Photo Validation

#### Validate Photo with AI
```http
POST /api/validate
Content-Type: application/json
x-internal-api-key: [required for external access]

{
  "image": "base64-encoded-image-data",
  "photoType": "meter_closeup"
}
```

**Response (200 OK):**
```json
{
  "isValid": true,
  "confidence": 0.95,
  "feedback": "Clear meter reading visible. Main disconnect amperage appears to be 200A.",
  "extractedData": {
    "amperage": 200,
    "meterType": "digital",
    "readingVisible": true
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing image or photoType
- `401 Unauthorized`: Invalid or missing API key
- `500 Internal Server Error`: OpenAI API errors

### 4. Photo Retrieval

#### Get Individual Photo
```http
GET /api/photos/{photoId}
x-internal-api-key: [required]
```

**Response (200 OK):**
```json
{
  "photo_id": "660e8400-e29b-41d4-a716-446655440001",
  "survey_id": "550e8400-e29b-41d4-a716-446655440000",
  "s3_key": "survey/tmp/uuid_meter_closeup.jpg",
  "s3_url": "https://bucket.s3.region.amazonaws.com/survey/tmp/uuid_meter_closeup.jpg",
  "photo_type": "meter_closeup",
  "capture_timestamp": "2024-01-01T10:15:00.000Z",
  "validation_json": {
    "isValid": true,
    "confidence": 0.95,
    "feedback": "Clear meter reading visible"
  },
  "presignedUrl": "https://bucket.s3.region.amazonaws.com/survey/tmp/uuid_meter_closeup.jpg?X-Amz-Signature=...",
  "urlExpiresIn": 3600
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing API key
- `404 Not Found`: Photo ID doesn't exist
- `500 Internal Server Error`: Database or S3 errors

