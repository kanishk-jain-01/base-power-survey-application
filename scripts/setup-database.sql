-- Base Power Survey Database Schema
-- Run this script on your PostgreSQL database to set up the required tables

-- Create photo type enum
CREATE TYPE photo_type AS ENUM (
  'meter_closeup',
  'meter_area_wide', 
  'meter_area_right',
  'meter_area_left',
  'adjacent_wall',
  'area_behind_fence',
  'ac_unit_label',
  'second_ac_unit_label',
  'breaker_box_interior',
  'main_disconnect_switch',
  'breaker_box_area'
);

-- Create customers table
CREATE TABLE customers (
  customer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create surveys table
CREATE TABLE surveys (
  survey_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(customer_id),
  start_timestamp TIMESTAMPTZ DEFAULT now(),
  completion_timestamp TIMESTAMPTZ,
  geolocation TEXT,
  main_disconnect_amperage SMALLINT,
  status TEXT CHECK (status IN ('pending','completed','validated','rejected')) DEFAULT 'pending',
  user_signature_data TEXT,
  notes TEXT,
  validation_results JSONB,
  CONSTRAINT survey_customer_fk FOREIGN KEY(customer_id) REFERENCES customers(customer_id)
);

-- Create photos table
CREATE TABLE photos (
  photo_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID REFERENCES surveys(survey_id) ON DELETE CASCADE,
  s3_key TEXT NOT NULL,
  s3_url TEXT NOT NULL,
  photo_type photo_type NOT NULL,
  capture_timestamp TIMESTAMPTZ DEFAULT now(),
  geolocation TEXT,
  validation_json JSONB,
  metadata JSONB
);

-- Create skipped steps table (for tracking UI state)
CREATE TABLE skipped_steps (
  survey_id UUID REFERENCES surveys(survey_id) ON DELETE CASCADE,
  step_id TEXT,
  PRIMARY KEY (survey_id, step_id)
);

-- Create indexes for frequently queried columns
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_surveys_customer_id ON surveys(customer_id);
CREATE INDEX idx_surveys_status ON surveys(status);
CREATE INDEX idx_photos_survey_id ON photos(survey_id);
CREATE INDEX idx_photos_type ON photos(photo_type);
CREATE INDEX idx_skipped_steps_survey_id ON skipped_steps(survey_id);

-- Add some helpful comments
COMMENT ON TABLE customers IS 'Customer information for survey participants';
COMMENT ON TABLE surveys IS 'Individual site surveys with metadata and results';
COMMENT ON TABLE photos IS 'Photos captured during surveys with validation results';
COMMENT ON COLUMN surveys.main_disconnect_amperage IS 'Critical amperage reading from main disconnect switch';
COMMENT ON COLUMN photos.validation_json IS 'AI validation results including confidence and extracted data';
