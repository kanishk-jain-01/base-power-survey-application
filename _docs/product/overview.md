# Base Power Survey App - Project Overview & User Flow

This document provides a high-level overview of the Base Power Company Site Survey Application and outlines the core user flow for conducting a site survey.

## 1. Project Description

The Base Power Company Site Survey Application is designed to streamline and enhance the process of collecting site survey data. It aims to replace manual, error-prone methods with a mobile-first, AI-guided solution. The application will enable field technicians to capture precise, validated data and imagery, ensuring accuracy and efficiency in site assessments. Key features include augmented reality (AR) guidance for photo framing, automated data extraction from images, and a robust backend for data storage and integration.

## 2. Core User Flow

The application guides the user through a structured process to capture all necessary site information.

1.  **Customer Email Input:**
    * The user begins by entering the customer's email address. This email serves as the unique identifier for the survey data, facilitating submission and retrieval.

2.  **Camera Feed Activation & AR Guidance:**
    * The app activates the mobile device's camera.
    * Live video feed is used to provide augmented reality (AR) guidance, helping the user frame specific shots correctly.

3.  **Photo Capture - Meter:**
    * **Electricity Meter (close-up):** User captures a detailed shot of the meter.
    * **Area Around Meter (wide shot):** A broader view encompassing the meter's surroundings.
    * **Area to the Right of Meter (wide shot):** Captures the area adjacent to the meter on the right.
    * **Area to the Left of Meter (wide shot):** Captures the area adjacent to the meter on the left.

4.  **Photo Capture - AC Unit:**
    * **A/C Unit (wide shot):** A general view of the air conditioning unit.
    * **A/C Unit Label (close-up):** A detailed shot of the unit's label for specifications.
    * **Second A/C Unit Label (conditional):** If applicable, a close-up of a second A/C unit's label is captured.

5.  **Photo Capture - Breaker Box:**
    * **Main Breaker Box Interior (open, showing breakers):** A clear shot of the open breaker box.
    * **Main Disconnect Switch (close-up):** A detailed shot of the main disconnect.
    * **Area Around Main Breaker Box (wide shot):** A broader view of the breaker box's surroundings.

6.  **Conditional Photos:**
    * The app prompts for any additional photos based on specific site conditions (e.g., if elements are obstructed by a fence), following an existing checklist.

7.  **User Confirmation and Submission:**
    * The user reviews all captured photos and data.
    * The user confirms the completeness and accuracy of the survey.
    * The survey data and images are then submitted to the backend for processing and storage.

    graph TD
    A[Start App] --> B[Enter Email]
    B --> C[Begin Survey]
    subgraph Guided Capture
        C --> D[Navigate to Location]
        D -->|AR Guidance| E[Capture Photo]
        E --> F[AI Validation]
        F -->|Valid| G[Next Location or Data Entry]
        F -->|Invalid| H[Feedback & Retry/Override]
        H --> E
        G -->|If Data Entry| I[Confirm or Manual Entry]
        I --> J[More Locations?]
        J -->|Yes| D
        J -->|No| K[Review All Data]
    end
    
    K --> L[Edit Photos/Data]
    L -->|Spot Edit| K
    L -->|Major Restart| C
    K --> M[Submit Survey]
    M --> N[Data Sent to Base API]
    N --> O[Confirmation Screen]
