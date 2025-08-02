# Base Power Survey Application

 The app guides users through capturing 11 specific photo types, validates them with AI, extracts critical electrical data (amperage readings), and securely stores everything in an AWS-backed infrastructure.

## Architecture Overview

```mermaid
graph TB
    A[Mobile Browser] --> B[Next.js Frontend]
    B --> C[Survey State Management]
    B --> D[Camera Capture]
    D --> E[AI Validation]
    E --> F[Next.js API Routes]
    F --> G[PostgreSQL RDS]
    F --> H[AWS S3]
    F --> I[OpenAI Vision API]
    
    subgraph "AWS Infrastructure"
        G
        H
        J[IAM Roles]
    end
    
    subgraph "Data Flow"
        K[Customer Email] --> G
        L[Survey Metadata] --> G
        M[Photo Files] --> H
        N[Validation Results] --> G
    end
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 15, React 18, TypeScript | Server-side rendering, type safety |
| **UI** | Tailwind CSS, ShadCN UI, Lucide React | Mobile-first design system |
| **State** | Zustand | Lightweight client state management |
| **AI/ML** | OpenAI GPT-4o Vision | Photo validation and data extraction |
| **Backend** | Next.js API Routes | RESTful survey submission/retrieval |
| **Database** | PostgreSQL on AWS RDS | Survey metadata and relationships |
| **Storage** | AWS S3 | Secure photo storage with private access |
| **Auth** | API Key authentication | Internal API protection |
| **Infrastructure** | AWS (RDS, S3, IAM) | Scalable cloud architecture |

## Project Structure

```
base-power-survey-app/
├── app/                    # Next.js 15 App Router
│   ├── api/surveys/        # REST API endpoints
│   ├── step/[stepId]/      # Dynamic survey step pages
│   └── review/             # Survey review and submission
├── components/             # Reusable UI components
│   ├── ui/                 # ShadCN base components
│   ├── CameraView.tsx      # Photo capture interface
│   └── PhotoPreview.tsx    # Validation result display
├── lib/                    # Utilities and configurations
│   ├── aws.ts              # S3 upload helpers
│   ├── db.ts               # PostgreSQL connection
│   └── surveySteps.ts      # Survey flow configuration
├── stores/                 # Zustand state management
├── scripts/                # Database setup and utilities
└── _docs/                  # Project documentation
```

## Set-Up

### Environment Variables

Create a `.env` file in the root directory:

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/dbname` |
| `AWS_REGION` | AWS region for RDS and S3 | `us-east-2` |
| `AWS_ACCESS_KEY_ID` | AWS IAM access key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key | `xyz123...` |
| `AWS_S3_BUCKET` | S3 bucket for photo storage | `base-power-survey-photos` |
| `OPENAI_API_KEY` | OpenAI API key for validation | `sk-proj-...` |
| `LLM_MODEL` | OpenAI model to use | `gpt-4o` |
| `INTERNAL_API_KEY` | Internal API authentication | `64-char-random-string` |

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/kanishk-jain-01/base-power-survey-application.git
   cd base-power-survey-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up AWS Infrastructure**
   - Create PostgreSQL RDS instance
   - Create S3 bucket with private access
   - Configure IAM user with appropriate permissions
   - See [AWS Setup Guide](#-aws-setup-guide) below for detailed configuration

4. **Initialize database**
   ```bash
   psql "your-database-url" -f scripts/setup-database.sql
   ```

5. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your actual credentials
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint with Next.js rules |
| `npm run type-check` | Run TypeScript compiler checks |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |


## Security 

- **HTTPS enforced** for all data transmission
- **IAM least-privilege** policies for AWS access
- **Private S3 bucket** with no public read access
- **API key authentication** for external access
- **Environment secrets** never committed to version control
- **SSL/TLS encryption** for database connections

## 🚢 Deployment

### Vercel 

1. **Connect repository** to Vercel
2. **Add environment variables** in project settings
3. **Deploy** - automatic builds on push to main


## AWS Setup Guide

### S3 Bucket Configuration

**Configure CORS for Presigned Uploads**
   
   In AWS Console → S3 → Your Bucket → Permissions → Cross-origin resource sharing (CORS):
   
   ```json
   [
       {
           "AllowedHeaders": ["*"],
           "AllowedMethods": ["PUT", "POST"],
           "AllowedOrigins": [
               "https://yourdomain.com",
               "https://your-vercel-app.vercel.app",
               "http://localhost:3000"
           ],
           "ExposeHeaders": ["ETag"],
           "MaxAgeSeconds": 3000
       }
   ]
   ```
   
   **⚠️ Important:** Replace the URLs with your actual domain names. The CORS configuration is required for browser uploads via presigned URLs.


### RDS PostgreSQL Configuration

1. **Create RDS Instance**
   - Engine: PostgreSQL 15+
   - Instance class: db.t3.micro (for development)
   - Storage: 20 GB gp3 (encrypted)
   - VPC: Default or custom with internet access
   - Security group: Allow port 5432 from your IP

2. **Security Group Rules**
   ```
   Type: PostgreSQL
   Protocol: TCP
   Port: 5432
   Source: Your IP address (for development)
           0.0.0.0/0 (for production with proper authentication)
   ```


### Environment Variables Setup

After creating your AWS resources, update your `.env` file:

```bash
# Database (from RDS endpoint)
DATABASE_URL=postgresql://survey_app:password@your-rds-endpoint:5432/database_name

# AWS Configuration
AWS_REGION=us-east-2
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=your-bucket-name

# API Keys
OPENAI_API_KEY=sk-proj-...
INTERNAL_API_KEY=your-64-char-random-string
```

### Retrieve Surveys
```http
GET /api/surveys?email=customer@example.com
x-internal-api-key: your-api-key

Response: {
  "surveys": [
    {
      "survey_id": "uuid",
      "email": "customer@example.com",
      "start_timestamp": "2024-01-01T00:00:00Z",
      "completion_timestamp": "2024-01-01T00:00:00Z",
      "main_disconnect_amperage": 200,
      "status": "completed",
      "photos": [
        {
          "photo_id": "uuid",
          "photo_type": "meter_closeup",
          "s3_url": "https://bucket.s3.region.amazonaws.com/path/to/photo.jpg",
          "presignedUrl": "https://bucket.s3.region.amazonaws.com/path/to/photo.jpg?X-Amz-Signature=...",
          "urlExpiresIn": 3600,
          "capture_timestamp": "2024-01-01T00:00:00Z",
          "validation_json": {
            "isValid": true,
            "confidence": 0.95,
            "feedback": "Clear meter reading visible"
          }
        }
      ]
    }
  ]
}
```

## Contact

**Project Maintainer:** Kanishk Jain  
**Email:** [kanishkjain01@icloud.com](mailto:kanishkjain01@icloud.com)  

---

⬆️ [Back to top](#-base-power-survey-application)
