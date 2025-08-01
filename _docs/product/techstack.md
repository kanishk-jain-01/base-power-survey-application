## 1. Frontend

- **Framework:** React + Next.js
  - **Reasoning:** Provides a robust, server-side rendered (SSR) framework for building fast, scalable, and SEO-friendly web applications, ideal for a mobile-first survey experience.
- **Styling:** TailwindCSS + ShadCN
  - **Reasoning:** TailwindCSS offers a utility-first CSS framework for rapid UI development and consistent branding. ShadCN provides a collection of accessible and customizable UI components built with Radix UI and styled with TailwindCSS, accelerating development.
- **State Management:** Zustand
  - **Reasoning:** A small, fast, and scalable state-management solution for React, offering simplicity and performance for managing application-wide data.

## 2. Backend

- **Primary Framework:** Next.js API Routes
  - **Reasoning:** Leverages the existing Next.js ecosystem for seamless full-stack development, enabling the creation of API endpoints directly within the frontend project.

## 3. Database & Cloud Platforms

- **Database:** PostgreSQL + Prisma ORM
  - **Reasoning:** PostgreSQL is a powerful, open-source relational database known for its reliability, data integrity, and extensibility. Prisma ORM provides a modern, type-safe database toolkit for efficient database interactions.
- **Cloud Platform:** AWS (Amazon Web Services)
  - **Reasoning:** A comprehensive and widely adopted cloud platform offering a vast array of services for scalable and secure infrastructure.
- **File Storage:** AWS S3
  - **Reasoning:** Highly scalable, durable, and secure object storage for storing captured photos and other survey-related files.

## 4. AI/ML Models

- **Core AI Strategy:** Multimodal LLMs for Post-Picture Analysis
  - **Reasoning:** To analyze and extract data from captured images, providing automated validation and data extraction.
- **LLM Service Module:** Custom module for model customization
  - **Reasoning:** Allows flexibility in integrating and swapping different LLMs (e.g., xAI, OpenAI) based on performance and cost requirements.
- **Object Detection (Stretch Goal):** YOLO
  - **Reasoning:** For real-time object detection and framing guidance during the photo capture process (e.g., using YOLO for ONNX.js client-side inference).
- **Client-Side OCR:** Tesseract.js
  - **Reasoning:** For optical character recognition directly within the browser, potentially for immediate feedback or initial data extraction.

