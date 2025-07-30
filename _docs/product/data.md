# Base Power Survey App - Data and Entity Relations

This document details the core data entities within the Base Power Company Site Survey Application and their relationships, ensuring a clear understanding of the information flow and storage.

## 1. Key Entities

Based on the survey requirements, the primary entities are:

* **Customer:** Represents the individual for whom the survey is being conducted.

  * `customer_id` (Primary Key)

  * `email` (Unique identifier, used for survey keying)

  * `name` (Optional, if collected)

  * `phone_number` (Optional)

* **Survey:** Represents a single completed site survey.

  * `survey_id` (Primary Key)

  * `customer_id` (Foreign Key to Customer)

  * `start_timestamp`

  * `completion_timestamp`

  * `geolocation` (Overall survey location)

  * `status` (e.g., 'pending', 'completed', 'validated', 'rejected')

  * `user_signature_data` (Digital signature)

  * `notes` (Any additional notes from the surveyor)

  * `validation_results` (JSON/Text field for AI validation output)

* **Photo:** Represents an individual photo captured during the survey. Each photo is associated with a specific survey and a type.

  * `photo_id` (Primary Key)

  * `survey_id` (Foreign Key to Survey)

  * `s3_url` (URL to the stored image in AWS S3)

  * `photo_type` (e.g., 'meter_closeup', 'ac_unit_wide', 'breaker_box_interior', 'conditional')

  * `capture_timestamp`

  * `geolocation` (Specific photo location, if different from survey)

  * `metadata` (JSON/Text field for EXIF data, AI analysis, etc.)

## 2. Relationships

The relationships between these entities are as follows:

* **One-to-Many (1:N) between Customer and Survey:**

  * A single `Customer` can have multiple `Surveys` associated with them over time.

  * Each `Survey` belongs to exactly one `Customer`.

* **One-to-Many (1:N) between Survey and Photo:**

  * A single `Survey` will contain multiple `Photos`.

  * Each `Photo` belongs to exactly one `Survey`.

## 3. Entity-Relationship Diagram (ERD)
erDiagram
    CUSTOMER ||--o{ SURVEY : has
    SURVEY ||--o{ PHOTO : contains

    CUSTOMER {
        VARCHAR customer_id PK
        VARCHAR email UK "Used for keying survey data"
        VARCHAR name
        VARCHAR phone_number
    }

    SURVEY {
        VARCHAR survey_id PK
        VARCHAR customer_id FK
        TIMESTAMP start_timestamp
        TIMESTAMP completion_timestamp
        VARCHAR geolocation "Overall survey location"
        VARCHAR status "e.g., 'pending', 'completed', 'validated'"
        TEXT user_signature_data
        TEXT notes
        JSONB validation_results "AI validation output"
    }

    PHOTO {
        VARCHAR photo_id PK
        VARCHAR survey_id FK
        VARCHAR s3_url "URL to AWS S3"
        VARCHAR photo_type "e.g., 'meter_closeup', 'ac_unit_wide'"
        TIMESTAMP capture_timestamp
        VARCHAR geolocation "Specific photo location"
        JSONB metadata "EXIF, AI analysis, etc."
    }