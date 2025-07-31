# Base Power Survey App - Data and Entity Relations

This document details the core data entities within the Base Power Company Site Survey Application and their relationships, ensuring a clear understanding of the information flow and storage.

## 1. Key Entities

Based on the survey requirements, the primary entities are:

- **Customer:** Represents the individual for whom the survey is being conducted.
  - `customer_id` (Primary Key)

  - `email` (Unique identifier, used for survey keying)

  - `name` (Optional, if collected)

  - `phone_number` (Optional)

- **Survey:** Represents a single completed site survey.
  - `survey_id` (Primary Key)

  - `customer_id` (Foreign Key to Customer)

  - `start_timestamp`

  - `completion_timestamp`

  - `geolocation` (Overall survey location)

  - `main_disconnect_amperage` (Critical: amperage number from main disconnect switch, e.g., 100, 150, 200)

  - `status` (e.g., 'pending', 'completed', 'validated', 'rejected')

  - `user_signature_data` (Digital signature)

  - `notes` (Any additional notes from the surveyor)

  - `validation_results` (JSON/Text field for overall survey-level AI validation)

- **Photo:** Represents an individual photo captured during the survey. Each photo is associated with a specific survey and a type.
  - `photo_id` (Primary Key)

  - `survey_id` (Foreign Key to Survey)

  - `s3_key` (S3 object key for the stored image)

  - `s3_url` (Full URL to the stored image in AWS S3)

  - `photo_type` (Enum: 'meter_closeup', 'meter_area_wide', 'meter_area_right', 'meter_area_left', 'adjacent_wall', 'area_behind_fence', 'ac_unit_label', 'second_ac_unit_label', 'breaker_box_interior', 'main_disconnect_switch', 'breaker_box_area')

  - `capture_timestamp`

  - `geolocation` (Specific photo location, if different from survey)

  - `validation_json` (JSON field for AI validation results: confidence, isValid, feedback, extractedData)

  - `metadata` (JSON field for EXIF data and other technical metadata)

## 2. Relationships

The relationships between these entities are as follows:

- **One-to-Many (1:N) between Customer and Survey:**
  - A single `Customer` can have multiple `Surveys` associated with them over time.

  - Each `Survey` belongs to exactly one `Customer`.

- **One-to-Many (1:N) between Survey and Photo:**
  - A single `Survey` will contain multiple `Photos`.

  - Each `Photo` belongs to exactly one `Survey`.

## 3. Entity-Relationship Diagram (ERD)

erDiagram
CUSTOMER ||--o{ SURVEY : has
SURVEY ||--o{ PHOTO : contains

    CUSTOMER {
        UUID customer_id PK
        VARCHAR email UK "Used for keying survey data"
        VARCHAR name
        VARCHAR phone_number
        TIMESTAMP created_at
    }

    SURVEY {
        UUID survey_id PK
        UUID customer_id FK
        TIMESTAMP start_timestamp
        TIMESTAMP completion_timestamp
        VARCHAR geolocation "Overall survey location"
        INT main_disconnect_amperage "Critical amperage value"
        VARCHAR status "e.g., 'pending', 'completed', 'validated'"
        TEXT user_signature_data
        TEXT notes
        JSONB validation_results "Overall survey AI validation"
    }

    PHOTO {
        UUID photo_id PK
        UUID survey_id FK
        VARCHAR s3_key "S3 object key"
        VARCHAR s3_url "Full URL to AWS S3"
        photo_type_enum photo_type "11 specific photo types"
        TIMESTAMP capture_timestamp
        VARCHAR geolocation "Specific photo location"
        JSONB validation_json "AI validation results per photo"
        JSONB metadata "EXIF and technical data"
    }
